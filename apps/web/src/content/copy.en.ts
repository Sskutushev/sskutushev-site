import type { SiteCopy } from './site-copy';

/**
 * The English half of the interface copy.
 *
 * Split out of `site-copy.ts` so the shape and the words change for different
 * reasons: the interface is edited when a surface gains a field, and these are
 * edited when a sentence is wrong. Both locales stay adjacent through the
 * `SiteCopy` type, which is what stops a Russian heading appearing over an
 * English paragraph.
 */
export const copyEn: SiteCopy = {
  skip: 'Skip to content',
  nav: { work: 'Work', system: 'System', about: 'About', contact: 'Contact', menu: 'Sections' },
  hero: {
    eyebrow: 'Fullstack / Product Engineer',
    lines: ['I build systems', 'that hold under', 'production load.'],
    behind: 1,
    lead: 'Backend-oriented fullstack engineer. I own the vertical end to end: domain invariants, money and access, cache, integrations and the production rollout.',
    availability: 'Open to senior+ fullstack work, backend-leaning',
    explore: 'Explore the system',
    source: 'View source',
  },
  layers: [
    {
      id: 'infra',
      label: 'INFRASTRUCTURE',
      description: 'Observable rollout with readiness, flags and rollback.',
      stack: 'Docker · GitHub Actions · OpenTelemetry',
      gain: 'A green build is not a conclusion about readiness. Traffic switches after the readiness check, and the way back is built first.',
    },
    {
      id: 'data',
      label: 'DATA',
      description: 'Transactional invariants. Unknown stays unknown.',
      stack: 'CockroachDB · Prisma · Redis · BigQuery',
      gain: 'A repeated operation returns the same result or a named conflict — never a second charge.',
    },
    {
      id: 'api',
      label: 'API',
      description: 'Typed contracts and boundaries the domain does not leak through.',
      stack: 'NestJS · GraphQL · WebSocket',
      gain: 'One typed, localised query, depth and complexity limits, and errors that carry no internal detail outward.',
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
    lines: ['I do not collect', 'technologies.'],
    body: 'Eleven years of work, five of them in commercial development; before that I managed sales at Coca-Cola HBC, which is still why I discuss a system in terms of consequences rather than technology. I design boundaries where every dependency solves a concrete operational problem. A system has to stay honest under load: money is not lost, access is not granted by mistake, and a missing value does not quietly become a convenient zero.',
    stack: [
      { label: 'Primary', value: 'TypeScript / NestJS' },
      { label: 'Data', value: 'CockroachDB / Prisma' },
      { label: 'Cache and queues', value: 'Redis / BullMQ' },
      { label: 'Delivery', value: 'Docker / CI / OTel' },
    ],
  },
  work: {
    note: 'Each case is behaviour under load, not a list of technologies.',
    open: 'How it is solved',
  },
  reviewer: {
    label: 'For a reviewer',
    title: 'What to check in ten minutes',
    command: 'git clone … && docker compose up',
    steps: [
      {
        title: 'Engineering mode',
        body: 'Frame time, draw calls, DPR and web vitals, measured in your own tab right now rather than screenshotted.',
      },
      {
        title: 'The verifiable section',
        body: 'The commit this page was built from, seventeen gates by name, and bundle sizes the build weighed itself.',
      },
      {
        title: 'Any case, then "How it is solved"',
        body: 'An excerpt from this repository with a link to the file. A test fails when the excerpt stops being verbatim.',
      },
      {
        title: 'Clone it and run it',
        body: 'CockroachDB, Redis, MinIO and the API come up with one command; migrations and the seed apply to a clean database.',
      },
      {
        title: 'Read the CI',
        body: 'Seventeen checks before publish: migrations on an empty database, budgets, axe, snapshots, Semgrep, images.',
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
    note: 'Everything here can be checked rather than taken on trust.',
    build: 'This build',
    atBuild: 'measured at build time',
    liveSurface: 'Live surface',
    liveNote:
      'The published GitHub Pages build calls an API on its own origin. There is none there — and that state is named rather than hidden.',
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
    note: 'The topology of this site, and what it does when a dependency disappears.',
    title: 'Read path',
    cards: [
      {
        label: 'Read',
        heading: 'One GraphQL aggregate',
        body: 'One typed, localised query. The frontend has no second source of data.',
      },
      {
        label: 'Resilience',
        heading: 'Redis SWR',
        body: 'Fresh, then stale, then an honest refusal. There is no silent zero.',
      },
      {
        label: 'Data and files',
        heading: 'CockroachDB + S3',
        body: 'Source of truth in the database; binaries go straight to storage, never through the API.',
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
    note: 'Values are measured in this browser session. Nothing here is a CI number presented as runtime state.',
  },
};
