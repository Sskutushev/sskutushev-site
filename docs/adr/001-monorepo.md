# ADR-001: pnpm monorepo without Nx

Status: accepted

The API and web application share one release and a small contract surface. pnpm workspaces provide deterministic installs and task orchestration without introducing an additional build graph. Nx is deferred until build caching or a larger package graph justifies it.
