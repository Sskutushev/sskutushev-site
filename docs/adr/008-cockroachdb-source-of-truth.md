# ADR-008: CockroachDB as the source of truth

Status: accepted

CockroachDB owns portfolio content, asset state, GitHub observations, delivery quality, public
events, and sampled performance telemetry. Prisma uses the CockroachDB provider and migrations are
additive-first. Redis and S3 may accelerate or hold binary data, but neither can replace the
relational state transitions and concurrency predicates stored here.

Serializable transaction conflicts are retried only for known Cockroach retry codes and only
around database work without external side effects.
