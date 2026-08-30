# ADR-010: S3-compatible asset lifecycle

Status: accepted

Binary assets bypass the API through short-lived, checksum-bound presigned uploads. The API owns
the `PENDING` → `READY` or `FAILED` state transition after verifying object metadata, MIME type,
checksum, and size. Confirmation is idempotent and internal storage keys are not exposed as public
download contracts.

The public resume uses the same storage boundary but is synchronized as a deployment preflight and
streamed through a bounded same-origin endpoint.
