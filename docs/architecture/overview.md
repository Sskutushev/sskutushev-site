# Architecture

```mermaid
flowchart LR
  Browser[React + R3F] -->|GraphQL| API[NestJS / Node.js]
  API -->|direct application queries| Prisma
  Prisma --> CockroachDB
  API -->|SWR cache| Redis
  API -->|presigned assets| S3[MinIO / S3 compatible]
```

CockroachDB is the source of truth. Redis is disposable and API availability does not depend on a successful cache write. The browser never proxies asset bytes through NestJS. The WebGL layer contains no essential text and can be removed without losing functionality.

The API remains one deployable service. Optional semantic search and synthetic probing are intentionally deferred until their production contracts and operational value are implemented; they are not placeholder services.
