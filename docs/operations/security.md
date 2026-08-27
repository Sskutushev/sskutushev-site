# Security model

- Production GraphQL playground and introspection are disabled.
- CORS is restricted to the configured web origin.
- DTO validation rejects non-allowlisted input.
- Provider errors and storage keys are not part of the public contract.
- Secrets live in environment variables and `.env` is ignored.
- Public production mutations are deferred and therefore expose no accidental write surface.

Before public deployment, request rate limiting and GraphQL depth/complexity limits are required at both edge and application layers.
