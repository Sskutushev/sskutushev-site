import type { SiteCopy } from './site-copy';

/**
 * The English half of the interface copy.
 *
 * Split out of `site-copy.ts` so the shape and the words change for different
 * reasons: the interface is edited when a surface gains a field, and these are
 * edited when a sentence is wrong.
 *
 * The register is deliberate. An engineer with something to prove writes in
 * aphorisms; these say what happened and what it cost, in the words anyone
 * would use out loud.
 */
export const copyEn: SiteCopy = {
  skip: 'Skip to content',
  nav: { work: 'Work', system: 'System', about: 'About', contact: 'Contact', menu: 'Sections' },
  hero: {
    eyebrow: 'Fullstack / Product Engineer',
    lines: ['I build systems', 'that hold under', 'production load.'],
    behind: 1,
    lead: 'I take a problem end to end, from the data model to the rollout. Usually money, access and search — the places where a mistake does not show up today, it shows up next week in a report.',
    availability: 'Open to senior+ fullstack work, backend-leaning',
    explore: 'Explore the system',
    source: 'View source',
  },
  layers: [
    {
      id: 'infra',
      label: 'INFRASTRUCTURE',
      description: 'A rollout you can watch: readiness, flags, rollback.',
      stack: 'Docker · GitHub Actions · OpenTelemetry',
      gain: 'A build passing is not the same as it being safe to ship. Traffic switches after the readiness check, and the way back exists before the rollout does.',
    },
    {
      id: 'data',
      label: 'DATA',
      description: 'Invariants inside the transaction. Unknown stays unknown.',
      stack: 'CockroachDB · Prisma · Redis · BigQuery',
      gain: 'If a request arrives twice, the money moves once. The second time returns the same answer, or a clear error.',
    },
    {
      id: 'api',
      label: 'API',
      description: 'Typed contracts, and a boundary the domain does not leak through.',
      stack: 'NestJS · GraphQL · WebSocket',
      gain: 'One page, one query. Depth and complexity are capped, and error text carries nothing the client has no business seeing.',
    },
  ],
  sections: {
    manifesto: 'Position',
    work: 'Selected systems',
    architecture: 'Live architecture',
    engineering: 'Verifiable',
    capabilities: 'Capabilities',
    experience: 'Experience',
    contact: 'Contact',
  },
  manifesto: {
    portrait: 'Open the photograph',
    lines: ['I do not collect', 'technologies.'],
    body: 'Eleven years of work, five of them writing code. Before that, sales at Coca-Cola HBC — which is why I still explain a system through its consequences rather than its stack. Every dependency here is present because it solves a specific problem, not because it reads well in a list. Under load only one thing matters: money is not lost, access is not granted by accident, and a missing value does not quietly become a convenient zero.',
    stack: [
      { label: 'Primary', value: 'TypeScript / NestJS' },
      { label: 'Data', value: 'CockroachDB / Prisma' },
      { label: 'Cache and queues', value: 'Redis / BullMQ' },
      { label: 'Delivery', value: 'Docker / CI / OTel' },
    ],
  },
  work: {
    note: 'These are about how a system behaves when something goes wrong.',
    open: 'How it is solved',
  },
  reviewer: {
    label: 'For a reviewer',
    title: 'What to check in ten minutes',
    command: 'git clone … && docker compose up',
    steps: [
      {
        title: 'Engineering mode',
        body: 'Frame time, draw calls, DPR and web vitals. Measured in your own tab right now, not attached as a screenshot.',
      },
      {
        title: 'The verifiable section',
        body: 'The commit this page was built from, seventeen gates by name, and bundle sizes the build weighed itself.',
      },
      {
        title: 'Any case, then "How it is solved"',
        body: 'A piece of code from this repository, with a link to the file. If it drifts from the original by one character, a test fails.',
      },
      {
        title: 'Clone it and run it',
        body: 'CockroachDB, Redis, MinIO and the API come up with one command. Migrations and data land on a clean database.',
      },
      {
        title: 'Read the CI',
        body: 'Seventeen checks before publish: migrations on an empty database, budgets, accessibility, snapshots, Semgrep, images.',
      },
    ],
  },
  caseNote: {
    context: 'Where it comes from',
    decision: 'What this code decides',
    consequence: 'What follows from it',
    otherwise: 'What would happen without it',
    close: 'Close',
  },
  engineeringSection: {
    note: 'All of this can be checked rather than taken on my word.',
    build: 'This build',
    atBuild: 'measured at build time',
    liveSurface: 'Live surface',
    liveNote:
      'The published build calls an API on its own domain. On GitHub Pages there is none — and the site says so plainly, rather than pretending the data is live.',
    commit: 'Commit',
    built: 'Built',
    gates: 'Gates before publish',
    gateList: 'Show the checks',
    bundle: 'Entry chunk',
    chunks: 'chunks',
    roundTrip: 'Round trip',
    events: 'Events',
    unknown: 'unknown',
    loading: 'Reading build evidence…',
    buildMissing: 'Build evidence is unavailable — this page was not produced by our pipeline.',
  },
  architecture: {
    note: 'How this site is put together, and what it does when one of the parts drops out.',
    title: 'Read path',
    cards: [
      {
        label: 'Read',
        heading: 'One GraphQL aggregate',
        body: 'One page, one query. The frontend has no second source of data.',
      },
      {
        label: 'Resilience',
        heading: 'Redis SWR',
        body: 'Fresh first, then stale, then an honest "could not". Nothing is quietly replaced by a zero.',
      },
      {
        label: 'Data and files',
        heading: 'CockroachDB + S3',
        body: 'The truth lives in the database. Files go straight to storage, past the API.',
      },
    ],
  },
  data: {
    live: 'Live from source',
    stale: 'Snapshot',
    failed: 'API unavailable — showing a verified static slice',
    simulated: 'Simulated',
  },
  theme: { toLight: 'Switch to light theme', toDark: 'Switch to dark theme' },
  engineering: {
    open: 'Open engineering mode',
    close: 'Close',
    title: 'Engineering mode',
    note: 'Everything is measured in this tab. No number here arrived from CI dressed as runtime.',
  },
};
