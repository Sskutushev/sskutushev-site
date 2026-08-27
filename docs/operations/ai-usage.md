# AI usage

AI was used as an implementation accelerator and secondary reviewer. Architectural decisions, test expectations and acceptance criteria were explicitly defined and remain reviewable through ADRs, tests and commit history.

Rejected suggestions include a generic repository layer over Prisma, Vanta/Spline for the hero, PostgreSQL instead of the required CockroachDB, a second backend without a bounded purpose, and fabricated dashboard metrics before CI measurement.
