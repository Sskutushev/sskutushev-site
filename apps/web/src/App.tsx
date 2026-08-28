import { useQuery } from '@tanstack/react-query';
import { lazy, Suspense, useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { CapabilityGrid, ContactPanel, ExperienceTimeline } from './components/ProfileSections';
import { RotatingSignal } from './components/RotatingSignal';
import { AssistantChat } from './components/AssistantChat';
import { GithubActivity } from './components/GithubActivity';
import { SiteControls } from './components/SiteControls';
import { QualityDashboard } from './components/QualityDashboard';
import { fallbackPortfolio } from './lib/fallback-portfolio';
import { fetchPortfolio, type Locale } from './lib/portfolio';
import { pointBudget, selectRenderQuality } from './lib/render-quality';
import { usePointerGlow } from './lib/use-pointer-glow';
import { useEngineeringMetrics } from './lib/use-engineering-metrics';
import { useSmoothScroll } from './lib/use-smooth-scroll';

const PointField = lazy(() => import('./scenes/PointField'));
const RankingScene = lazy(() => import('./scenes/RankingScene'));
const PipelineScene = lazy(() => import('./scenes/PipelineScene'));
const copy = {
  RU: {
    skip: 'К проектам',
    nav: ['Кейсы', 'Система', 'Контакт'],
    status: 'СИСТЕМА В СЕТИ',
    hero: ['FULLSTACK', 'С ГЛУБИНОЙ В BACKEND.'],
    explore: 'ИССЛЕДОВАТЬ СИСТЕМУ',
    position: 'ПОЗИЦИОНИРОВАНИЕ',
    positionTitle: 'СОЗДАЮ СИСТЕМЫ, КОТОРЫЕ',
    positionAccent: 'ОСТАЮТСЯ ЧЕСТНЫМИ ПОД НАГРУЗКОЙ.',
    positionBody:
      'Не коллекционирую технологии. Проектирую границы, где каждая зависимость решает конкретную эксплуатационную задачу.',
    cases: 'ВЫБРАННЫЕ СИСТЕМЫ',
    architecture: 'ЖИВАЯ АРХИТЕКТУРА',
    architectureTitle: 'НЕ МАКЕТ.',
    architectureAccent: 'РАБОТАЮЩИЙ ВЕРТИКАЛЬНЫЙ СРЕЗ.',
  },
  EN: {
    skip: 'Skip to work',
    nav: ['Cases', 'System', 'Contact'],
    status: 'SYSTEM ONLINE',
    hero: ['FULLSTACK', 'BUILT BACKEND-DEEP.'],
    explore: 'EXPLORE THE SYSTEM',
    position: 'POSITION',
    positionTitle: 'I BUILD SYSTEMS THAT',
    positionAccent: 'STAY TRUE UNDER PRESSURE.',
    positionBody:
      'I do not collect technologies. I design boundaries where every dependency solves a concrete operational problem.',
    cases: 'SELECTED SYSTEMS',
    architecture: 'LIVE ARCHITECTURE',
    architectureTitle: 'NOT A MOCKUP.',
    architectureAccent: 'A RUNNING VERTICAL SLICE.',
  },
} as const;
export default function App(): React.JSX.Element {
  const [locale, setLocale] = useState<Locale>('RU');
  const [theme, setTheme] = useState<'thermal' | 'blueprint'>('thermal');
  const [engineering, setEngineering] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const quality = selectRenderQuality(window.innerWidth, reduced);
  const runtime = useEngineeringMetrics();
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);
  const clock = (timeZone: string) =>
    new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone,
    }).format(now);
  usePointerGlow(reduced);
  useSmoothScroll(reduced);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.3 });
  const { data = fallbackPortfolio[locale], isError } = useQuery({
    queryKey: ['portfolio', locale],
    queryFn: () => fetchPortfolio(locale),
    retry: 1,
  });
  const text = copy[locale];

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = locale === 'RU' ? 'ru' : 'en';
  }, [locale]);

  return (
    <>
      <motion.div aria-hidden="true" className="scroll-progress" style={{ scaleX }} />
      <a className="skip" href="#work">
        {text.skip}
      </a>
      <header className="nav">
        <a className="mark" href="#top">
          SS<span>/</span>26
        </a>
        <nav aria-label="Главная навигация">
          <a href="#work">{text.nav[0]}</a>
          <a href="#system">{text.nav[1]}</a>
          <a href="#contact">{text.nav[2]}</a>
        </nav>
        <SiteControls
          locale={locale}
          theme={theme}
          onEngineering={() => setEngineering(!engineering)}
          onLocale={() => setLocale(locale === 'RU' ? 'EN' : 'RU')}
          onTheme={() => setTheme(theme === 'thermal' ? 'blueprint' : 'thermal')}
        />
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
            <i /> {text.status}{' '}
            <span>
              {data.weather
                ? `${data.weather.city} ${Math.round(data.weather.temperatureC)}°C ${data.weather.condition} · ${clock('Europe/Moscow')}`
                : `SPB ${clock('Europe/Moscow')} · UTC ${clock('UTC')}`}
            </span>
          </div>
          <motion.h1
            initial={reduced ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {text.hero[0]}
            <br />
            <em>{text.hero[1]}</em>
          </motion.h1>
          <p className="lede">{data.profile.summary}</p>
          <RotatingSignal />
          <div className="hero-actions">
            <a className="primary" href="#work">
              {text.explore} ↘
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
          <p className="section-no">01 / {text.position}</p>
          <h2>
            {text.positionTitle}
            <br />
            <span>{text.positionAccent}</span>
          </h2>
          <div className="manifesto-grid">
            <figure className="portrait">
              <img
                src={`${import.meta.env.BASE_URL}profile.jpg`}
                width="512"
                height="512"
                loading="lazy"
                alt="Сергей Кутушев, Senior+ Fullstack Product Engineer"
              />
              <figcaption>
                <span>SS / PORTRAIT</span>
                <span>UTC+3</span>
              </figcaption>
            </figure>
            <p>{text.positionBody}</p>
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
            <p className="section-no">02 / {text.cases}</p>
            <p>
              REAL CONSTRAINTS
              <br />
              MEASURABLE BEHAVIOUR
            </p>
          </div>
          <div className="cases">
            {data.caseStudies.map((item, index) => (
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

        {!reduced && (
          <section className="ranking-section" aria-label="Interactive ranking projection">
            <div className="section-head">
              <p className="section-no">03 / DATA HONESTY</p>
              <p>
                ONE DATASET
                <br />
                THREE EXPLICIT PROJECTIONS
              </p>
            </div>
            <Suspense fallback={<div className="visual-fallback" />}>
              <RankingScene />
            </Suspense>
          </section>
        )}

        <CapabilityGrid skills={data.skills} locale={locale} />
        <ExperienceTimeline items={data.experience} locale={locale} />

        <section className="architecture">
          <p className="section-no">06 / {text.architecture}</p>
          <h2>
            {text.architectureTitle}
            <br />
            <span>{text.architectureAccent}</span>
          </h2>
          {!reduced && (
            <Suspense fallback={<div className="visual-fallback" />}>
              <PipelineScene />
            </Suspense>
          )}
          <div className="pipeline-console">
            <div>
              <small>READ PATH</small>
              <strong>GraphQL aggregate</strong>
              <span>Typed · localized · cached</span>
            </div>
            <div>
              <small>RESILIENCE</small>
              <strong>Redis SWR</strong>
              <span>Fresh → stale → honest fallback</span>
            </div>
            <div>
              <small>DATA / ASSETS</small>
              <strong>Cockroach + S3</strong>
              <span>Source of truth · direct upload</span>
            </div>
          </div>
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
      <ContactPanel locale={locale} />
      {engineering && (
        <aside aria-labelledby="engineering-title" className="drawer" role="dialog">
          <button aria-label="Close engineering mode" onClick={() => setEngineering(false)}>
            CLOSE ×
          </button>
          <h2 id="engineering-title">ENGINEERING MODE</h2>
          <dl>
            <div>
              <dt>FPS / FRAME</dt>
              <dd>
                {runtime.frameMs
                  ? `${Math.round(1000 / runtime.frameMs)} / ${runtime.frameMs.toFixed(1)}MS`
                  : '—'}
              </dd>
            </div>
            <div>
              <dt>POINTS</dt>
              <dd>{pointBudget(quality).toLocaleString('ru-RU') || 'STATIC'}</dd>
            </div>
            <div>
              <dt>DPR</dt>
              <dd>{window.devicePixelRatio.toFixed(2)}</dd>
            </div>
            <div>
              <dt>DRAW CALLS</dt>
              <dd>{runtime.drawCalls || '—'}</dd>
            </div>
            <div>
              <dt>GRAPHQL / SERVER</dt>
              <dd>
                {runtime.graphqlRttMs?.toFixed(0) ?? '—'} / {runtime.serverMs?.toFixed(0) ?? '—'} MS
              </dd>
            </div>
            <div>
              <dt>LCP / INP / CLS</dt>
              <dd>
                {runtime.vitals.LCP?.toFixed(0) ?? '—'} / {runtime.vitals.INP?.toFixed(0) ?? '—'} /{' '}
                {runtime.vitals.CLS?.toFixed(3) ?? '—'}
              </dd>
            </div>
            <div>
              <dt>DATA</dt>
              <dd>{data.stale ? 'STALE' : 'LIVE'}</dd>
            </div>
          </dl>
          <p>Runtime values are shown as measured state. No invented CI metrics.</p>
          <GithubActivity locale={locale} />
          <QualityDashboard locale={locale} />
          <AssistantChat locale={locale} />
        </aside>
      )}
    </>
  );
}
