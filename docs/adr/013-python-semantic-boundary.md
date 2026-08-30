# ADR-013: bounded Python semantic ranking

Status: accepted

The Python FastAPI service performs deterministic Unicode-aware TF-IDF ranking over supplied
portfolio evidence. It stores no source-of-truth data and is not a second application backend.
NestJS applies a bounded timeout, validates the response contract, and falls back to its local text
ranker on transport or contract failure.

No vector database is introduced because the current corpus does not justify another operational
dependency.
