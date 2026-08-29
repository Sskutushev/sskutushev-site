import { Reveal } from './Reveal';
import type { Locale, Portfolio } from '../lib/portfolio';

const copy = {
  RU: {
    capability: 'КАРТА КОМПЕТЕНЦИЙ',
    capabilityTitle: 'FULLSTACK — ОСНОВА.',
    capabilityAccent: 'BACKEND 60%. FRONTEND 40%.',
    experience: 'ОПЫТ',
    experienceTitle: 'ОТ БИЗНЕС-КОНТЕКСТА',
    experienceAccent: 'К PRODUCTION OWNERSHIP.',
    contact: 'СОЗДАДИМ СИСТЕМУ,',
    contactAccent: 'КОТОРАЯ ВЫДЕРЖИТ.',
    resumeOpen: 'ОТКРЫТЬ РЕЗЮМЕ',
    resumeDownload: 'СКАЧАТЬ PDF',
  },
  EN: {
    capability: 'CAPABILITY MAP',
    capabilityTitle: 'FULLSTACK CORE.',
    capabilityAccent: 'BACKEND DEPTH. FRONTEND STRENGTH.',
    experience: 'EXPERIENCE SIGNAL',
    experienceTitle: 'FROM BUSINESS CONTEXT',
    experienceAccent: 'TO PRODUCTION OWNERSHIP.',
    contact: "LET'S BUILD SOMETHING",
    contactAccent: 'THAT HOLDS.',
    resumeOpen: 'OPEN RESUME',
    resumeDownload: 'DOWNLOAD PDF',
  },
} as const;

const capabilityMeta: Record<
  Locale,
  Record<string, { share: string; description: string; signals: string[] }>
> = {
  RU: {
    Backend: {
      share: '60% CORE',
      description:
        'Доменные инварианты, money/access flows, typed contracts и отказоустойчивые интеграции.',
      signals: ['IDEMPOTENCY', 'FAIL-CLOSED', 'REALTIME'],
    },
    Frontend: {
      share: '40% PRODUCT',
      description:
        'Полноценный frontend ownership: сложные состояния, data-heavy UI, performance и WebGL.',
      signals: ['REACT', 'RESPONSIVE', 'R3F'],
    },
    Data: {
      share: 'SOURCE OF TRUTH',
      description:
        'Транзакционные и аналитические контуры без подмены unknown красивыми, но ложными данными.',
      signals: ['SQL', 'CACHE', 'VECTOR'],
    },
    Infrastructure: {
      share: 'SHIP & OPERATE',
      description:
        'Контейнеры, Kubernetes, storage и контролируемый rollout с readiness и rollback.',
      signals: ['CI/CD', 'S3', 'OTEL'],
    },
    Quality: {
      share: 'GUARDRAILS',
      description:
        'Негативные пути, regression discipline и исполняемые проверки вместо доверия на слово.',
      signals: ['E2E', 'SECURITY', 'PROFILING'],
    },
  },
  EN: {
    Backend: {
      share: '60% CORE',
      description:
        'Domain invariants, money/access flows, typed contracts and resilient integrations.',
      signals: ['IDEMPOTENCY', 'FAIL-CLOSED', 'REALTIME'],
    },
    Frontend: {
      share: '40% PRODUCT',
      description: 'Full frontend ownership: complex state, data-heavy UI, performance and WebGL.',
      signals: ['REACT', 'RESPONSIVE', 'R3F'],
    },
    Data: {
      share: 'SOURCE OF TRUTH',
      description:
        'Transactional and analytical flows without turning unknown into convenient fiction.',
      signals: ['SQL', 'CACHE', 'VECTOR'],
    },
    Infrastructure: {
      share: 'SHIP & OPERATE',
      description:
        'Containers, Kubernetes, storage and controlled rollouts with readiness and rollback.',
      signals: ['CI/CD', 'S3', 'OTEL'],
    },
    Quality: {
      share: 'GUARDRAILS',
      description: 'Negative paths, regression discipline and executable checks instead of trust.',
      signals: ['E2E', 'SECURITY', 'PROFILING'],
    },
  },
};

export function CapabilityGrid({
  skills,
  locale,
}: {
  skills: Portfolio['skills'];
  locale: Locale;
}): React.JSX.Element {
  const groups = skills.reduce<Map<string, Portfolio['skills']>>((result, skill) => {
    const items = result.get(skill.category) ?? [];
    result.set(skill.category, [...items, skill]);
    return result;
  }, new Map());
  const text = copy[locale];
  return (
    <section className="capabilities" id="stack">
      <Reveal>
        <p className="section-no">04 / {text.capability}</p>
        <h2>
          {text.capabilityTitle}
          <br />
          <span>{text.capabilityAccent}</span>
        </h2>
      </Reveal>
      <div className="capability-grid">
        {Array.from(groups, ([category, items], index) => (
          <Reveal className="capability-card" key={category}>
            <header>
              <small>0{index + 1}</small>
              <strong>{capabilityMeta[locale][category]?.share ?? 'ENGINEERING'}</strong>
            </header>
            <h3>{category}</h3>
            <p>{capabilityMeta[locale][category]?.description}</p>
            <div className="capability-signals">
              {capabilityMeta[locale][category]?.signals.map((signal) => (
                <b key={signal}>{signal}</b>
              ))}
            </div>
            <div className="skill-list">
              {items.map((skill) => (
                <span key={skill.name}>{skill.name}</span>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function ExperienceTimeline({
  items,
  locale,
}: {
  items: Portfolio['experience'];
  locale: Locale;
}): React.JSX.Element {
  const text = copy[locale];
  return (
    <section className="experience" id="experience">
      <Reveal>
        <p className="section-no">05 / {text.experience}</p>
        <h2>
          {text.experienceTitle}
          <br />
          <span>{text.experienceAccent}</span>
        </h2>
      </Reveal>
      <div className="timeline">
        {items.map((item, index) => (
          <Reveal className="timeline-item" key={`${item.company}-${item.period}`}>
            <div className="timeline-index">0{index + 1}</div>
            <div>
              <span>{item.period}</span>
              <h3>{item.company}</h3>
              <strong>{item.role}</strong>
            </div>
            <div>
              <p>{item.summary}</p>
              {item.highlights.length > 0 && (
                <ul>
                  {item.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function ContactPanel({ locale }: { locale: Locale }): React.JSX.Element {
  const text = copy[locale];
  const graphqlUrl = import.meta.env.VITE_GRAPHQL_URL || '/graphql';
  const resumeUrl = new URL(
    '/assets/resume',
    new URL(graphqlUrl, window.location.origin).origin,
  ).toString();
  return (
    <footer id="contact">
      <Reveal className="contact-intro">
        <small>
          <i /> AVAILABLE FOR SENIOR+ FULLSTACK / PRODUCT ENGINEERING
        </small>
        <p>
          {text.contact}
          <br />
          <em>{text.contactAccent}</em>
        </p>
        <span>
          {locale === 'RU'
            ? 'Backend 60% · Frontend 40% · DevOps · Security · Data'
            : 'Backend 60% · Frontend 40% · DevOps · Security · Data'}
        </span>
      </Reveal>
      <div className="contact-actions">
        <a href="mailto:sskutushev@gmail.com">
          EMAIL <span>↗</span>
          <small>sskutushev@gmail.com</small>
        </a>
        <a href="https://t.me/sskutushev" target="_blank" rel="noreferrer">
          TELEGRAM <span>↗</span>
          <small>@sskutushev</small>
        </a>
        <a href="https://github.com/Sskutushev" target="_blank" rel="noreferrer">
          GITHUB <span>↗</span>
          <small>/Sskutushev</small>
        </a>
        <a href="https://www.linkedin.com/in/sskutushev/" target="_blank" rel="noreferrer">
          LINKEDIN <span>↗</span>
          <small>/in/sskutushev</small>
        </a>
        <div className="resume-actions">
          <a href={resumeUrl} target="_blank" rel="noreferrer">
            {text.resumeOpen} <span>↗</span>
          </a>
          <a href={resumeUrl} download="sergey-kutushev-resume.pdf">
            {text.resumeDownload} <span>↓</span>
          </a>
        </div>
      </div>
      <small className="copyright">© 2026 SERGEY KUTUSHEV · SAINT PETERSBURG · UTC+3</small>
    </footer>
  );
}
