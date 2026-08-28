# Synthetic probe

The Go probe independently verifies the public page, API readiness, a real portfolio GraphQL query
and the RFC 6455 `graphql-transport-ws` upgrade. It exports only bounded Prometheus labels and keeps
the last measured result for every check. It owns no application data and can run outside the main
deployment to detect failures that internal health checks cannot see.
