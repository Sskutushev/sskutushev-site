import type { Locale } from '../lib/portfolio';
import { copyEn } from './copy.en';
import { copyRu } from './copy.ru';

/**
 * All interface copy lives here with both locales adjacent, so a Russian
 * heading cannot end up over an English paragraph. Display line breaks are
 * authored per locale because Russian runs 15–25% longer than English at the
 * same content and must not be left to the browser.
 */
export interface SiteCopy {
  skip: string;
  nav: { work: string; system: string; about: string; contact: string; menu: string };
  hero: {
    eyebrow: string;
    /** One entry per rendered display line. */
    lines: string[];
    /** Index of the line that renders behind the System Core. Pick the line
     * that actually crosses the object: a line that clears it entirely makes
     * the composition flat no matter which side of the canvas it is on. */
    behind: number;
    lead: string;
    availability: string;
    explore: string;
    source: string;
  };
  layers: { id: string; label: string; description: string; stack: string; gain: string }[];
  sections: {
    manifesto: string;
    work: string;
    architecture: string;
    engineering: string;
    capabilities: string;
    experience: string;
    contact: string;
  };
  engineeringSection: {
    note: string;
    build: string;
    atBuild: string;
    liveSurface: string;
    liveNote: string;
    commit: string;
    built: string;
    gates: string;
    gateList: string;
    bundle: string;
    chunks: string;
    roundTrip: string;
    events: string;
    unknown: string;
    loading: string;
    buildMissing: string;
  };
  manifesto: { lines: string[]; body: string; stack: { label: string; value: string }[] };
  work: { note: string; open: string };
  reviewer: {
    label: string;
    title: string;
    command: string;
    steps: { title: string; body: string }[];
  };
  caseNote: {
    context: string;
    decision: string;
    consequence: string;
    otherwise: string;
    close: string;
  };
  architecture: {
    note: string;
    title: string;
    cards: { label: string; heading: string; body: string }[];
  };
  data: { live: string; stale: string; failed: string; simulated: string };
  theme: { toLight: string; toDark: string };
  engineering: { open: string; close: string; title: string; note: string };
}

export const siteCopy: Record<Locale, SiteCopy> = { RU: copyRu, EN: copyEn };
