# ADR-006: grounded profile assistant

Status: accepted

The assistant retrieves compact evidence from the existing portfolio aggregate before invoking Gemini. It is not a general chatbot and never receives private resume files, credentials or database metadata.

Gemini is called only from NestJS with a server-side API key, an eight-second timeout and a bounded prompt. If the provider is unavailable, the API returns an extractive answer with the same citations. The browser receives answer text, source labels and an explicit `generated` flag. Vector infrastructure is deferred: deterministic lexical ranking is sufficient for the current small, curated corpus and is easier to explain live.
