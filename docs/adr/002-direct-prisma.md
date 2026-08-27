# ADR-002: Prisma is called by application services

Status: accepted

NestJS services call Prisma directly. A repository that only mirrors `prisma.model` would hide useful query semantics without creating a real boundary. Storage keeps an interface because local MinIO and production S3-compatible providers are replaceable infrastructure.
