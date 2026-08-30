# ADR-015: truthful bounded telemetry storage

Status: accepted

CI quality observations and sampled browser performance values are stored in CockroachDB because
their volume is bounded and they must stay tied to immutable revisions. Runtime counters and traces
remain in Prometheus and OpenTelemetry rather than being copied into application tables.

The browser never invents missing values: unknown stays unknown. Telemetry excludes visitor
identifiers, raw query parameters, credential headers, and unbounded route labels.
