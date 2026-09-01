# ADR-020: cases quote the repository that implemented them

Status: accepted. Extends the excerpt rule stated in `apps/web/src/cases/case-notes.ts`.

Every case chapter shows the code that decides it, and until now every excerpt came from this
repository. That worked while the cases described this system. It stopped working for the two
chapters that describe work done in C#: `Financial Concurrency` listed C# in its stack and showed
TypeScript written for this site, and `Search / Cache Reliability` described a caching contract
implemented in .NET and showed the local one. An excerpt written here to illustrate work done
elsewhere argues the same point with weaker evidence, and a stack line that disagrees with the code
beneath it is the exact defect the excerpts exist to prevent.

Two public repositories now supply those excerpts: `PM-GROWTH` for the optimistic-concurrency write
in a timesheet whose hours become money, and `Power-Test` for the cache that degrades to its last
good snapshot rather than to an error. Nothing private is quoted, and nothing is paraphrased.

**Excerpts from another repository are pinned to a commit, never to a branch.** The point of showing
code is that a reviewer can check it; a branch link stops being a check the moment the branch moves,
and a case that quotes a file which no longer says that is worse than a case with no code at all.
The pinned commits live in one map so that two excerpts from one repository are always read at the
same revision — otherwise the page shows two states of a codebase that never coexisted.

Verification splits along the same line. `case-notes.spec.ts` reads this repository's excerpts from
disk and keeps doing so. It cannot read a file that is not on this disk, so
`scripts/check-quoted-code.mjs` fetches each pinned file from GitHub and asserts the excerpt appears
verbatim, and `10 · Frontend quality` runs it. It is a script rather than a test because it needs
the network: a unit suite that reaches out fails for reasons that have nothing to do with the code
under it, and such failures get read as noise. A pinned commit cannot change underneath us, so this
check passing today and failing tomorrow means one thing — the excerpt was edited here.

The alternative considered was linking to the other repository without quoting it. Rejected: a link
is a promise that the reviewer will go and read it, and the whole argument of the case chapters is
that the claim and its evidence sit on the same screen.
