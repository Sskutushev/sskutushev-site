# ADR-007: optimistic portfolio writes

Status: accepted

Portfolio management uses an integer version supplied as `expectedVersion`. The update predicate
matches both the record identity and that version, then increments it atomically. A zero-row update
is a named conflict, never a silent last-write-wins overwrite.

Profile fields and ordered social links are committed in one CockroachDB transaction. Redis cache
invalidation happens only after commit because Redis cannot participate in that transaction and is
not a source of truth. Mutations are disabled by default and may be enabled only in a trusted
management environment. Authentication for a public management surface is intentionally outside
this slice; enabling mutations on the public API without an authenticated edge is unsupported.
