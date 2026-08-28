# Security model

- Production GraphQL playground and introspection are disabled.
- CORS is restricted to the configured web origin.
- DTO validation rejects non-allowlisted input.
- Provider errors and storage keys are not part of the public contract.
- Secrets live in environment variables and `.env` is ignored.
- The optional GitHub token is server-only; the adapter requests public repository metadata with a
  six-second timeout and never exposes provider errors or credentials through GraphQL.
- Public production mutations are disabled and therefore expose no accidental write surface.
- Management mutations remain fail-closed unless explicitly enabled in a trusted environment;
  bounded validated inputs and optimistic versions prevent blind or stale overwrites.

The application applies a Redis-backed per-client request limit, emits a request ID and sets
nosniff, referrer, permissions and cross-origin resource headers. Rate-limit storage fails open so
Redis cannot take down public reads; production must also enforce limits at the edge. GraphQL
operations are rejected above depth 10 or 200 selected fields, including named fragments.

All GraphQL mutations require both `ENABLE_MUTATIONS=true` and an exact bearer credential matching
the 32+ character `MANAGEMENT_TOKEN`. Public production environments remain mutation-disabled;
the quality importer uses a protected management endpoint and never embeds this token in the web app.

The profile assistant treats questions as untrusted input, limits them to 500 characters, retrieves only public portfolio evidence and sends a bounded prompt to Gemini with an eight-second timeout. Provider keys remain server-side. Responses expose citations and whether Gemini or the extractive fallback produced the answer; provider errors and credentials are never returned to clients.
