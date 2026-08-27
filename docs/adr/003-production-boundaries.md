# ADR-003: one API, explicit infrastructure boundaries

Status: accepted

CockroachDB is the source of truth. Redis handles disposable cache and queued work. S3-compatible storage holds binary assets. GitHub synchronization runs asynchronously. These concerns remain modules inside one NestJS deployment so the assignment demonstrates operational boundaries without a microservice zoo.
