import { ArrowUpRight, Download } from 'lucide-react';
import { CoreStill } from '../three/CoreStill';
import { ReviewerPath } from './ReviewerPath';
import type { SiteCopy } from '../content/site-copy';
import type { Locale } from '../lib/portfolio';
import { StatusDot } from '../ui/StatusDot';

const CHANNELS = [
  {
    id: 'email',
    label: 'Email',
    value: 'sskutushev@gmail.com',
    href: 'mailto:sskutushev@gmail.com',
  },
  { id: 'telegram', label: 'Telegram', value: '@sskutushev', href: 'https://t.me/sskutushev' },
  { id: 'github', label: 'GitHub', value: '/Sskutushev', href: 'https://github.com/Sskutushev' },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    value: '/in/sskutushev',
    href: 'https://www.linkedin.com/in/sskutushev/',
  },
] as const;

const CLOSING: Record<Locale, string[]> = {
  RU: ['Соберём систему,', 'которая выдержит.'],
  EN: ['Let us build', 'something that holds.'],
};

const RESUME: Record<Locale, { open: string; download: string }> = {
  RU: { open: 'Открыть резюме', download: 'Скачать PDF' },
  EN: { open: 'Open resume', download: 'Download PDF' },
};

function resumeUrl(): string {
  const graphql = import.meta.env.VITE_GRAPHQL_URL || '/graphql';
  return new URL('/assets/resume', new URL(graphql, window.location.origin).origin).toString();
}

export function Contact({
  copy,
  locale,
  onEngineering,
}: {
  copy: SiteCopy;
  locale: Locale;
  onEngineering: () => void;
}): React.JSX.Element {
  const resume = resumeUrl();
  return (
    <footer className="contact" id="contact">
      <ReviewerPath copy={copy} onEngineering={onEngineering} />
      {/* The object the first screen opened with, drawn once more and at rest.
          It is the line-work rather than the canvas: one persistent canvas is
          the performance contract, and this is the form every visitor on a
          software renderer saw at the top of the page anyway. */}
      <div aria-hidden className="contact__core">
        <CoreStill />
      </div>
      <div className="grid">
        <div className="contact__title">
          <p className="contact__availability t-meta">
            <StatusDot state="ok" />
            {copy.hero.availability}
          </p>
          <h2 className="t-h1">
            {CLOSING[locale].map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
          </h2>
        </div>
        <div className="contact__links">
          {CHANNELS.map((channel) => (
            <a
              href={channel.href}
              key={channel.id}
              rel={channel.href.startsWith('http') ? 'noreferrer' : undefined}
              target={channel.href.startsWith('http') ? '_blank' : undefined}
            >
              <b className="t-body">{channel.label}</b>
              <small>{channel.value}</small>
              <ArrowUpRight aria-hidden size={16} strokeWidth={1.5} />
            </a>
          ))}
          <div className="contact__resume">
            <a className="button button--primary" href={resume} rel="noreferrer" target="_blank">
              {RESUME[locale].open}
              <ArrowUpRight aria-hidden size={18} strokeWidth={1.5} />
            </a>
            <a className="button button--quiet" download="sergey-kutushev-resume.pdf" href={resume}>
              {RESUME[locale].download}
              <Download aria-hidden size={18} strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>
      <div className="contact__foot t-meta-sm">
        <span>© 2026 Sergey Kutushev</span>
        <span>Saint Petersburg · UTC+3</span>
      </div>
    </footer>
  );
}
