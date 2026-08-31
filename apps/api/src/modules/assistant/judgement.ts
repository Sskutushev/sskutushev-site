import { Locale } from '../portfolio/portfolio.models';
import type { KnowledgeChunk } from './retrieval';

/**
 * What was decided, refused and got wrong.
 *
 * The rest of the knowledge base describes what was built. None of it answers
 * the questions that actually separate engineers — which call turned out to be
 * wrong, what was deliberately kept boring, what was refused — so the assistant
 * had nothing to retrieve for them and answered from whichever case study
 * happened to share a word with the question.
 *
 * Both locales, because retrieval here is word overlap: a Russian question
 * against an English source scores near zero, which is the same defect as a
 * Russian heading over an English paragraph and is fixed the same way.
 *
 * Every entry is drawn from a decision record in this repository or from the
 * August 2026 competency review. None of it is written to sound good.
 */
const RU: KnowledgeChunk[] = [
  {
    label: 'Суждение / Решение, которое оказалось ошибкой',
    text: 'Объект в первом экране был задуман как оптическое стекло и сделан на screen-space transmission. На видеокарте он читался как сплошной фиолетовый ком с полосами по краям: материал восстанавливал оболочку из низкого буфера всего, что за ней, и светящееся ядро размазывалось по всему объёму. Поймали это поздно, потому что headless-тесты идут на программном рендерере и сцену отклоняют — все визуальные снимки были картинкой запасной композиции, а на сам объект не было ни одной проверки. Заменено на отражающую оболочку, записано в ADR-019.',
  },
  {
    label: 'Суждение / Где выбрано более скучное решение',
    text: 'За сиквенсом первого экрана стояла анимационная библиотека. Замер показал, что к ней обращается ровно один файл, ради четырёх изменений прозрачности и значения прокрутки, и весит она 44 КБ gzip — четверть входного чанка, перед той самой отрисовкой, которую анимирует. Теперь это слушатель прокрутки, схлопнутый на кадр анимации, который публикует прогресс как custom properties, а их читает таблица стилей. Все такты остались там же, чистыми функциями под юнит-тестами. Записано в ADR-018.',
  },
  {
    label: 'Суждение / Что было сложнее доказать, чем сделать',
    text: 'Идемпотентность в денежном контуре. Написать проверку повтора просто; доказать, что повтор никогда не приведёт ко второму движению, значит доказать это при ретраях, при конкурентных писателях и при отказе хранилища посреди операции. Ключ должен был стать идентичностью операции, а не производной от даты и суммы; повтор должен сверяться с исходным движением, а не с флагом; при недоступном durable storage поведение должно быть fail-closed. Ценность несут негативные тесты: replay, гонка, fail-open, неверная дробность денег.',
  },
  {
    label: 'Суждение / От чего отказался',
    text: 'От инфраструктуры ради резюме. План этого репозитория прямо запрещает вводить Kafka, RabbitMQ, Elasticsearch, ClickHouse, Qdrant, Kubernetes и Terraform, если текущая фаза их не требует, и у каждого сервиса, который здесь есть, написана причина и ADR: Redis под кэш и очередь, CockroachDB как источник истины, Python под одно ограниченное вычисление, Go под один probe. ClickHouse осознанно вынесен в заметку о масштабировании, а не развёрнут ради упоминания.',
  },
  {
    label: 'Суждение / Известные слабые места',
    text: 'Из ассессмента компетенций за август 2026, названо прямо: при высокой скорости поставки архитектурная декомпозиция иногда происходит реактивно, уже после того как файл или контур разросся. Часть side effects в CRM исторически осталась best-effort и inline там, где правильная форма — transactional outbox. Широкий личный ownership создаёт высокий bus factor, и для следующего уровня нужна передача backend-контуров второму владельцу и регулярный архитектурный review чужих изменений. Глубина по данным сильная на уровне продукта и запросов, но меньше доказательств владения внутренностями СУБД.',
  },
  {
    label: 'Суждение / Как относится к инцидентам',
    text: 'Восстановление сервиса не считается исправлением. После митигации формализуется причина, ставится регрессионный тест на самом низком уровне, где дефект реально виден, планируются превентивные меры и наблюдаемость, и выкат повторяется безопасно. Внешний аудит команды летом 2026 зафиксировал долю тестов 41% — лучший показатель в команде — и формулировку «лучшая тестовая дисциплина в команде». Характер тестов важнее процента: они проверяют негативные пути и инварианты, а не строки, которые поменялись.',
  },
];

const EN: KnowledgeChunk[] = [
  {
    label: 'Judgement / A decision that was wrong',
    text: 'The hero object was specified as optical glass and built with screen-space transmission. On a GPU it read as a solid violet lump with banding at the edges: the material resolved the shell from a low-resolution buffer of everything behind it, so the emissive core smeared across the whole volume. It was caught late because the headless suite runs on a software renderer and refuses the scene, so every visual baseline was a picture of the fallback and the object itself had no gate on it at all. Replaced with a reflective shell; recorded in ADR-019.',
  },
  {
    label: 'Judgement / Choosing the more boring option',
    text: 'The hero scroll sequence had an animation library behind it. Measurement showed it was reached for by one file, for four opacity ramps and a scroll value, and weighed 44KB gzip — a quarter of the entry chunk, in front of the paint it was animating. It is now a scroll listener collapsed onto an animation frame, publishing progress as custom properties the stylesheet reads. The beats stayed where they were, as pure functions under unit test. Recorded in ADR-018.',
  },
  {
    label: 'Judgement / Hardest thing to prove rather than to build',
    text: 'Idempotency in a money path. Building the repeat check is straightforward; proving that a repeat can never produce a second movement means proving it across retries, concurrent writers, and a storage outage in the middle. The key had to become the identity of the operation rather than a derivative of its date and amount, the repeat had to be checked against the original movement rather than against a flag, and behaviour with durable storage unavailable had to be fail-closed. The tests that matter are the negative ones: replay, race, fail-open, wrong money precision.',
  },
  {
    label: 'Judgement / What was refused',
    text: 'Infrastructure added for the sake of the resume. The implementation plan for this repository names Kafka, RabbitMQ, Elasticsearch, ClickHouse, Qdrant, Kubernetes and Terraform as things that may not be introduced unless the current phase requires them, and every service that is here has a written reason and an ADR: Redis for cache and queue, CockroachDB as the source of truth, Python for one bounded computation, Go for one probe. ClickHouse is deliberately deferred to a scaling note rather than deployed to be mentioned.',
  },
  {
    label: 'Judgement / Known weaknesses',
    text: 'From the August 2026 competency review, stated rather than hidden: at high delivery speed architectural decomposition sometimes happens reactively, after a file or a contour has already grown. Some CRM side effects stayed best-effort and inline where a transactional outbox is the correct shape. Broad personal ownership creates a high bus factor, and the next level needs backend contours handed to a second owner and regular architectural review of other people work. Data-platform depth is strong at the product and query level, with less evidence of database-internals ownership.',
  },
  {
    label: 'Judgement / How incidents are treated',
    text: 'Restoring service is not considered the fix. After mitigation the cause is written down, a regression test is added at the lowest level where the defect is actually visible, prevention and observability are planned, and the rollout is repeated safely. An external audit over the summer of 2026 put the test ratio at 41%, the highest on the team, and described the test discipline as the best on the team. The character of those tests matters more than the number: they cover negative paths and invariants rather than the lines that changed.',
  },
];

export function judgementChunks(locale: Locale): KnowledgeChunk[] {
  return locale === Locale.RU ? RU : EN;
}
