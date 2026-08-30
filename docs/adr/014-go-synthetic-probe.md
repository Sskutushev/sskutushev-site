# ADR-014: dependency-free Go synthetic probe

Status: accepted

The Go binary concurrently verifies the public document, readiness, GraphQL aggregate, S3 resume,
and WebSocket protocol. It exports bounded Prometheus metrics and can run once as a deployment
smoke gate or continuously as an observability component.

The probe is outside the serving path. Its failure reports loss of evidence but never changes API
or web availability.
