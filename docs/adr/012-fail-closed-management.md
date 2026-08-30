# ADR-012: fail-closed management and optimistic concurrency

Status: accepted

Management operations are unavailable unless `ENABLE_MUTATIONS=true` and the management key is
valid. Profile writes require `expectedVersion`; the version predicate and related social-link
replacement execute in one transaction. A stale writer receives a named conflict instead of a
last-write-wins overwrite.

Cache invalidation happens only after commit, keeping external side effects outside retryable
CockroachDB transaction work.
