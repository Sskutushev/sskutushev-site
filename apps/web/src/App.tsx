import { useQuery } from '@tanstack/react-query';
import { lazy, Suspense, useEffect, useState } from 'react';
import { fetchPortfolio, type Locale } from './lib/portfolio';
import { pointBudget, selectRenderQuality } from './lib/render-quality';

const PointField = lazy(() => import('./scenes/PointField'));
const fallback = {
  profile: {
    fullName: 'Сергей Скутушев',
    headline: 'TypeScript Backend / Product Engineer',
    summary:
      'Проектирую надежные продуктовые системы — от инвариантов и API-контрактов до production rollout.',
    location: 'Remote · UTC+3',
    availability: 'Open to meaningful backend work',
    yearsExperience: 3,
  },
  skills: ['TypeScript', 'NestJS', 'GraphQL', 'CockroachDB', 'Prisma', 'Docker', 'Redis', 'S3'].map(
    (name) => ({ name, category: 'Engineering' }),
  ),
  caseStudies: [],
  socialLinks: [{ type: 'GitHub', url: 'https://github.com/Sskutushev' }],
  stale: true,
};

export default function App(): React.JSX.Element {
  const [locale, setLocale] = useState<Locale>('RU');
  const [theme, setTheme] = useState<'thermal' | 'blueprint'>('thermal');
  const [engineering, setEngineering] = useState(false);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const quality = selectRenderQuality(window.innerWidth, reduced);
  const { data = fallback, isError } = useQuery({
    queryKey: ['portfolio', locale],
    queryFn: () => fetchPortfolio(locale),
    retry: 1,
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <>
      <a className="skip" href="#work">
        К проектам
      </a>
      <header className="nav">
        <a className="mark" href="#top">
          SS<span>/</span>26
        </a>
        <nav aria-label="Главная навигация">
          <a href="#work">Кейсы</a>
          <a href="#system">Система</a>
          <a href="#contact">Контакт</a>
        </nav>
        <div className="controls">
          <button onClick={() => setEngineering(!engineering)}>ENG</button>
          <button onClick={() => setLocale(locale === 'RU' ? 'EN' : 'RU')}>{locale}</button>
          <button
            aria-label="Сменить тему"
            onClick={() => setTheme(theme === 'thermal' ? 'blueprint' : 'thermal')}
          >
            ◐
          </button>
        </div>
      </header>
      <main id="top">
        <section className="hero">
          {!reduced && (
            <div className="scene">
              <Suspense fallback={null}>
                <PointField />
              </Suspense>
            </div>
          )}
          <div className="eyebrow">
            <i /> SYSTEM ONLINE <span>UTC+3 / REMOTE</span>
          </div>
          <h1>
            BACKEND
            <br />
            <em>WITH CONSEQUENCE.</em>
          </h1>
          <p className="lede">{data.profile.summary}</p>
          <div className="hero-actions">
            <a className="primary" href="#work">
              EXPLORE THE SYSTEM ↘
            </a>
            <a href="https://github.com/Sskutushev" rel="noreferrer" target="_blank">
              VIEW SOURCE ↗
            </a>
          </div>
          <div className="ticker">
            <span>TYPE-SAFE CONTRACTS</span>
            <span>DATA HONESTY</span>
            <span>FAIL-CLOSED FLOWS</span>
            <span>OBSERVABLE DELIVERY</span>
          </div>
        </section>

        <section className="manifesto" id="system">
          <p className="section-no">01 / POSITION</p>
          <h2>
            I BUILD SYSTEMS THAT
            <br />
            <span>STAY TRUE UNDER PRESSURE.</span>
          </h2>
          <div className="manifesto-grid">
            <p>
              Не коллекционирую технологии. Проектирую границы, где каждая зависимость решает
              конкретную эксплуатационную задачу.
            </p>
            <dl>
              <div>
                <dt>PRIMARY</dt>
                <dd>TypeScript / NestJS</dd>
              </div>
              <div>
                <dt>DATA</dt>
                <dd>CockroachDB / Prisma</dd>
              </div>
              <div>
                <dt>DELIVERY</dt>
                <dd>Docker / CI / Observability</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="work" id="work">
          <div className="section-head">
            <p className="section-no">02 / SELECTED SYSTEMS</p>
            <p>
              REAL CONSTRAINTS
              <br />
              MEASURABLE BEHAVIOUR
            </p>
          </div>
          <div className="cases">
            {(data.caseStudies.length
              ? data.caseStudies
              : [
                  {
                    slug: 'money',
                    title: 'Money & Entitlement',
                    problem: 'Деньги и доступ не терпят оптимистичных допущений.',
                    approach: 'Idempotency · ledger · fail-closed grant',
                    result: 'Replay-safe state machine',
                    technologies: ['NestJS', 'CockroachDB'],
                  },
                  {
                    slug: 'ranking',
                    title: 'Ranking / Data Honesty',
                    problem: 'Unknown не должен превращаться в ноль.',
                    approach: 'Cohorts · confidence · explicit basis',
                    result: 'Explainable projections',
                    technologies: ['TypeScript', 'GraphQL'],
                  },
                  {
                    slug: 'cache',
                    title: 'Search / Cache Reliability',
                    problem: 'Падение provider не должно ронять продукт.',
                    approach: 'SWR · in-flight dedupe · stale truth',
                    result: 'Graceful degradation',
                    technologies: ['Redis', 'BullMQ'],
                  },
                ]
            ).map((item, index) => (
              <article className="case" key={item.slug}>
                <span>0{index + 1}</span>
                <div>
                  <p className="case-tag">CASE STUDY / {item.technologies.join(' · ')}</p>
                  <h3>{item.title}</h3>
                  <p>{item.problem}</p>
                  <strong>{item.approach}</strong>
                </div>
                <b>↗</b>
              </article>
            ))}
          </div>
        </section>

        <section className="architecture">
          <p className="section-no">03 / LIVE ARCHITECTURE</p>
          <h2>
            NOT A MOCKUP.
            <br />
            <span>A RUNNING VERTICAL SLICE.</span>
          </h2>
          <div className="pipeline">
            {[
              'REACT + R3F',
              'GRAPHQL API',
              'NESTJS',
              'REDIS / QUEUE',
              'PRISMA',
              'COCKROACHDB',
              'S3 / MINIO',
            ].map((node, index) => (
              <div key={node}>
                <small>0{index + 1}</small>
                {node}
                <i />
              </div>
            ))}
          </div>
          <p className="truth">
            {isError
              ? 'API OFFLINE · STATIC CONTENT ACTIVE'
              : data.stale
                ? 'STALE SNAPSHOT · SOURCE MARKED HONESTLY'
                : 'LIVE DATA · SOURCE OF TRUTH CONNECTED'}
          </p>
        </section>
      </main>
      <footer id="contact">
        <p>
          LET'S BUILD SOMETHING
          <br />
          <em>THAT HOLDS.</em>
        </p>
        <a href="https://github.com/Sskutushev">GITHUB ↗</a>
        <small>© 2026 SERGEY SKUTUSHEV · UTC+3</small>
      </footer>
      {engineering && (
        <aside className="drawer">
          <button onClick={() => setEngineering(false)}>CLOSE ×</button>
          <h2>ENGINEERING MODE</h2>
          <dl>
            <div>
              <dt>POINTS</dt>
              <dd>{pointBudget(quality).toLocaleString('ru-RU') || 'STATIC'}</dd>
            </div>
            <div>
              <dt>DPR CAP</dt>
              <dd>1.5</dd>
            </div>
            <div>
              <dt>DRAW CALL</dt>
              <dd>1</dd>
            </div>
            <div>
              <dt>DATA</dt>
              <dd>{data.stale ? 'STALE' : 'LIVE'}</dd>
            </div>
          </dl>
          <p>Runtime values are shown as measured state. No invented CI metrics.</p>
        </aside>
      )}
    </>
  );
}
