package main

import (
	"bytes"
	"context"
	"crypto/rand"
	"crypto/sha1"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"os"
	"sort"
	"strings"
	"sync"
	"time"
)

type result struct {
	success  bool
	duration time.Duration
	checked  time.Time
}

type probe struct {
	client  *http.Client
	siteURL string
	apiURL  string
	mu      sync.RWMutex
	results map[string]result
}

func main() {
	p := &probe{
		client:  &http.Client{Timeout: 8 * time.Second},
		siteURL: required("SITE_URL"),
		apiURL:  required("API_URL"),
		results: make(map[string]result),
	}
	interval, err := time.ParseDuration(environment("PROBE_INTERVAL", "30s"))
	if err != nil || interval < 5*time.Second {
		slog.Error("invalid PROBE_INTERVAL")
		os.Exit(2)
	}
	success := p.run(context.Background())
	if environment("PROBE_ONCE", "false") == "true" {
		if !success {
			os.Exit(1)
		}
		slog.Info("synthetic smoke passed")
		return
	}
	go func() {
		ticker := time.NewTicker(interval)
		defer ticker.Stop()
		for range ticker.C {
			p.run(context.Background())
		}
	}()
	http.HandleFunc("/health/live", func(w http.ResponseWriter, _ *http.Request) {
		writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
	})
	http.HandleFunc("/metrics", p.metrics)
	address := environment("PROBE_ADDRESS", ":8080")
	slog.Info("synthetic probe listening", "address", address)
	server := &http.Server{Addr: address, ReadHeaderTimeout: 5 * time.Second}
	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		slog.Error("probe server failed", "error", err)
		os.Exit(1)
	}
}

func (p *probe) run(ctx context.Context) bool {
	checks := map[string]func(context.Context) error{
		"public_http": func(ctx context.Context) error { return p.get(ctx, p.siteURL) },
		"readiness":   func(ctx context.Context) error { return p.get(ctx, p.apiURL+"/health/ready") },
		"graphql":     p.graphql,
		"websocket":   p.websocket,
	}
	success := true
	for name, check := range checks {
		started := time.Now()
		err := check(ctx)
		p.mu.Lock()
		p.results[name] = result{success: err == nil, duration: time.Since(started), checked: time.Now()}
		p.mu.Unlock()
		if err != nil {
			success = false
			slog.Warn("synthetic check failed", "check", name, "error", err)
		}
	}
	return success
}

func (p *probe) get(ctx context.Context, endpoint string) error {
	request, err := http.NewRequestWithContext(ctx, http.MethodGet, endpoint, nil)
	if err != nil {
		return err
	}
	response, err := p.client.Do(request)
	if err != nil {
		return err
	}
	defer response.Body.Close()
	if response.StatusCode < 200 || response.StatusCode >= 300 {
		return fmt.Errorf("unexpected status %d", response.StatusCode)
	}
	return nil
}

func (p *probe) graphql(ctx context.Context) error {
	body := bytes.NewBufferString(`{"query":"query SyntheticProbe { portfolioData(locale: EN) { profile { fullName } } githubActivity { source fetchedAt } latestQualityRun { sha environment } }"}`)
	request, err := http.NewRequestWithContext(ctx, http.MethodPost, p.apiURL+"/graphql", body)
	if err != nil {
		return err
	}
	request.Header.Set("content-type", "application/json")
	response, err := p.client.Do(request)
	if err != nil {
		return err
	}
	defer response.Body.Close()
	payload, err := io.ReadAll(io.LimitReader(response.Body, 1<<20))
	if err != nil {
		return err
	}
	if response.StatusCode != http.StatusOK ||
		!bytes.Contains(payload, []byte(`"portfolioData"`)) ||
		!bytes.Contains(payload, []byte(`"githubActivity"`)) ||
		!bytes.Contains(payload, []byte(`"latestQualityRun"`)) ||
		bytes.Contains(payload, []byte(`"errors"`)) {
		return fmt.Errorf("GraphQL contract failed with status %d", response.StatusCode)
	}
	return nil
}

func (p *probe) websocket(ctx context.Context) error {
	keyBytes := make([]byte, 16)
	if _, err := rand.Read(keyBytes); err != nil {
		return err
	}
	key := base64.StdEncoding.EncodeToString(keyBytes)
	// net/http performs the RFC 6455 Upgrade over HTTP(S); ws:// is not a
	// transport scheme understood by http.Client.
	request, err := http.NewRequestWithContext(ctx, http.MethodGet, p.apiURL+"/graphql", nil)
	if err != nil {
		return err
	}
	request.Header.Set("Connection", "Upgrade")
	request.Header.Set("Upgrade", "websocket")
	request.Header.Set("Sec-WebSocket-Version", "13")
	request.Header.Set("Sec-WebSocket-Key", key)
	request.Header.Set("Sec-WebSocket-Protocol", "graphql-transport-ws")
	response, err := p.client.Do(request)
	if err != nil {
		return err
	}
	defer response.Body.Close()
	expected := sha1.Sum([]byte(key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"))
	if response.StatusCode != http.StatusSwitchingProtocols ||
		response.Header.Get("Sec-WebSocket-Accept") != base64.StdEncoding.EncodeToString(expected[:]) {
		return fmt.Errorf("websocket upgrade failed with status %d", response.StatusCode)
	}
	return nil
}

func (p *probe) metrics(w http.ResponseWriter, _ *http.Request) {
	p.mu.RLock()
	defer p.mu.RUnlock()
	w.Header().Set("content-type", "text/plain; version=0.0.4")
	names := make([]string, 0, len(p.results))
	for name := range p.results {
		names = append(names, name)
	}
	sort.Strings(names)
	for _, name := range names {
		value := p.results[name]
		success := 0
		if value.success {
			success = 1
		}
		fmt.Fprintf(w, "portfolio_probe_success{check=%q} %d\n", name, success)
		fmt.Fprintf(w, "portfolio_probe_duration_seconds{check=%q} %.6f\n", name, value.duration.Seconds())
		fmt.Fprintf(w, "portfolio_probe_last_check_timestamp_seconds{check=%q} %d\n", name, value.checked.Unix())
	}
}

func required(name string) string {
	value := strings.TrimSpace(os.Getenv(name))
	if value == "" {
		slog.Error("required environment variable missing", "name", name)
		os.Exit(2)
	}
	return strings.TrimRight(value, "/")
}

func environment(name, fallback string) string {
	if value := strings.TrimSpace(os.Getenv(name)); value != "" {
		return value
	}
	return fallback
}

func writeJSON(w http.ResponseWriter, status int, value any) {
	w.Header().Set("content-type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(value)
}
