package main

import (
	"context"
	"crypto/sha1"
	"encoding/base64"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"
)

func TestProbeContracts(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch {
		case r.URL.Path == "/health/ready":
			writeJSON(w, 200, map[string]string{"status": "ready"})
		case r.URL.Path == "/graphql" && r.Method == http.MethodPost:
			writeJSON(w, 200, map[string]any{"data": map[string]any{"portfolioData": map[string]any{}}})
		default:
			w.WriteHeader(200)
		}
	}))
	defer server.Close()
	p := &probe{client: server.Client(), siteURL: server.URL, apiURL: server.URL, results: make(map[string]result)}
	p.run(context.Background())
	if !p.results["public_http"].success || !p.results["readiness"].success || !p.results["graphql"].success {
		t.Fatalf("expected HTTP contracts to pass: %#v", p.results)
	}
}

func TestWebsocketHandshake(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		key := r.Header.Get("Sec-WebSocket-Key")
		accept := sha1.Sum([]byte(key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"))
		hijacker := w.(http.Hijacker)
		connection, buffer, err := hijacker.Hijack()
		if err != nil {
			t.Error(err)
			return
		}
		defer connection.Close()
		fmt.Fprintf(buffer, "HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: %s\r\n\r\n", base64.StdEncoding.EncodeToString(accept[:]))
		_ = buffer.Flush()
	}))
	defer server.Close()
	p := &probe{client: &http.Client{Timeout: time.Second}, apiURL: server.URL}
	if err := p.websocket(context.Background()); err != nil {
		t.Fatal(err)
	}
}

func TestMetricsHaveBoundedLabels(t *testing.T) {
	p := &probe{results: map[string]result{"graphql": {success: true, duration: time.Millisecond, checked: time.Unix(10, 0)}}}
	recorder := httptest.NewRecorder()
	p.metrics(recorder, httptest.NewRequest(http.MethodGet, "/metrics", nil))
	if body := recorder.Body.String(); !strings.Contains(body, `portfolio_probe_success{check="graphql"} 1`) {
		t.Fatalf("unexpected metrics: %s", body)
	}
}
