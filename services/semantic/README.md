# Similarity service

This bounded Python service ranks a request-provided evidence corpus using Unicode word and
character n-gram TF-IDF cosine similarity. Character features make Russian/English morphology and
technical identifiers less brittle than exact token matching. It owns no source of truth and
returns no generated claims; NestJS remains responsible for authorization, corpus construction and
fallback behavior. Qdrant is intentionally absent because the portfolio corpus is small.

`POST /v1/rank` returns a versioned boundary contract:
`{"matches":[{"caseStudyId":"...","score":0.82}],"modelVersion":"lexical-v1"}`. Nest applies an
800 ms timeout and falls back to local text/tag retrieval when the service is unavailable or the
response violates this shape.
