# Security model

- Production GraphQL playground and introspection are disabled.
- CORS is restricted to the configured web origin.
- DTO validation rejects non-allowlisted input.
- Provider errors and storage keys are not part of the public contract.
- Secrets live in environment variables and `.env` is ignored.
- The optional GitHub token is server-only; the adapter requests public repository metadata with a
  six-second timeout and never exposes provider errors or credentials through GraphQL.
- Public production mutations are deferred and therefore expose no accidental write surface.

Before public deployment, request rate limiting and GraphQL depth/complexity limits are required at both edge and application layers.

The profile assistant treats questions as untrusted input, limits them to 500 characters, retrieves only public portfolio evidence and sends a bounded prompt to Gemini with an eight-second timeout. Provider keys remain server-side. Responses expose citations and whether Gemini or the extractive fallback produced the answer; provider errors and credentials are never returned to clients.
