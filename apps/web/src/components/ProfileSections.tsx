import { Reveal } from './Reveal';
import type { Locale, Portfolio } from '../lib/portfolio';

const copy = {
  RU: {
    capability: 'КАРТА КОМПЕТЕНЦИЙ',
    capabilityTitle: 'BACKEND — ОСНОВА.',
    capabilityAccent: 'ПОЛНЫЙ ПРОДУКТОВЫЙ КОНТУР.',
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
    capabilityTitle: 'BACKEND FIRST.',
    capabilityAccent: 'FULL PRODUCT RANGE.',
    experience: 'EXPERIENCE SIGNAL',
    experienceTitle: 'FROM BUSINESS CONTEXT',
    experienceAccent: 'TO PRODUCTION OWNERSHIP.',
    contact: "LET'S BUILD SOMETHING",
    contactAccent: 'THAT HOLDS.',
    resumeOpen: 'OPEN RESUME',
    resumeDownload: 'DOWNLOAD PDF',
  },
} as const;

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
        <p className="section-no">03 / {text.capability}</p>
        <h2>
          {text.capabilityTitle}
          <br />
          <span>{text.capabilityAccent}</span>
        </h2>
      </Reveal>
      <div className="capability-grid">
        {Array.from(groups, ([category, items], index) => (
          <Reveal className="capability-card" key={category}>
            <small>0{index + 1}</small>
            <h3>{category}</h3>
            <div>
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
        <p className="section-no">04 / {text.experience}</p>
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
  const resumeUrl = `${import.meta.env.BASE_URL}sergey-skutushev-resume.pdf`;
  return (
    <footer id="contact">
      <Reveal>
        <p>
          {text.contact}
          <br />
          <em>{text.contactAccent}</em>
        </p>
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
          <a href={resumeUrl} download="sergey-skutushev-resume.pdf">
            {text.resumeDownload} <span>↓</span>
          </a>
        </div>
      </div>
      <small className="copyright">© 2026 SERGEY SKUTUSHEV · SAINT PETERSBURG · UTC+3</small>
    </footer>
  );
}
