# ADR-009: Redis for disposable SWR state and queued refresh

Status: accepted

Redis provides stale-while-revalidate cache entries, in-flight refresh deduplication, pub/sub
fanout, and the optional BullMQ GitHub refresh schedule. Cache writes are best-effort and public
reads retain database or provider fallbacks, so Redis failure cannot become a portfolio outage.

Keys and TTLs stay inside the cache and worker boundaries; feature resolvers do not access Redis
directly.
