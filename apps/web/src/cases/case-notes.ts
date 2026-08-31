import type { Locale } from '../lib/portfolio';

export interface CaseNote {
  /** Why the problem exists at all. */
  context: Record<Locale, string>;
  /** What the excerpt decides, in one sentence. */
  decision: Record<Locale, string>;
  /** What holds because of it. */
  consequence: Record<Locale, string>;
  /** What happens without it. */
  otherwise: Record<Locale, string>;
  code: {
    /** Repository-relative path. Asserted to contain the excerpt verbatim. */
    file: string;
    language: string;
    lines: string[];
  };
}

/**
 * What each case actually decided, and the code that decides it.
 *
 * Every excerpt is a verbatim slice of a file in this repository, and
 * `case-notes.spec.ts` fails when it stops being one. Code that drifts out of
 * agreement with the system it illustrates is worse than no code at all: it
 * reads as evidence while being decoration.
 *
 * Nothing from a private codebase is quoted. Where a case has a public
 * implementation elsewhere it is linked rather than copied.
 */
export const caseNotes: Record<string, CaseNote> = {
  'money-entitlement': {
    context: {
      RU: 'Загрузка идёт напрямую в объектное хранилище по подписанной ссылке, поэтому подтверждение приходит отдельным вызовом — и приходит повторно: сеть, ретрай клиента, двойной клик.',
      EN: 'The upload goes straight to object storage through a presigned URL, so the confirmation is a separate call — and it arrives more than once: the network, a client retry, a double click.',
    },
    decision: {
      RU: 'Повторный confirm возвращает уже готовый ресурс, а несовпадение с заявленным переводит его в FAILED вместо приёмки.',
      EN: 'A repeated confirm returns the asset already made ready; anything that does not match what was declared moves it to FAILED instead of being accepted.',
    },
    consequence: {
      RU: 'Идемпотентность здесь — свойство домена, а не HTTP: повтор либо возвращает тот же результат, либо даёт именованный конфликт. Объект проверяется до перевода в READY, поэтому «оплачено, но не выдано» не может стать состоянием.',
      EN: 'Idempotency here is a property of the domain, not of HTTP: a repeat either returns the same result or gives a named conflict. The object is verified before anything is marked READY, so paid-for-but-not-granted cannot become a state.',
    },
    otherwise: {
      RU: 'Без первой строки повтор создал бы второй ресурс. Без проверки объекта в хранилище лежал бы файл, не совпадающий с тем, что было заявлено и оплачено.',
      EN: 'Without the first line a repeat would create a second asset. Without the object check, storage would hold a file that does not match what was declared and paid for.',
    },
    code: {
      file: 'apps/api/src/modules/assets/assets.service.ts',
      language: 'typescript',
      lines: [
        "    if (asset.status === 'READY')",
        '      return { id: asset.id, status: asset.status, contentType: asset.contentType };',
        '    const object = await this.storage.inspect(asset.storageKey);',
        "    const maxBytes = BigInt(this.config.getOrThrow<number>('ASSET_MAX_BYTES'));",
        '    if (',
        '      object.contentType !== asset.contentType ||',
        '      object.checksumSha256 !== asset.checksum ||',
        '      object.sizeBytes > maxBytes',
        '    ) {',
        "      await this.prisma.asset.update({ where: { id: asset.id }, data: { status: 'FAILED' } });",
        "      throw new ForbiddenException('Uploaded object does not match the request constraints');",
        '    }',
        '    const ready = await this.prisma.asset.update({',
        '      where: { id: asset.id },',
        "      data: { status: 'READY', sizeBytes: object.sizeBytes },",
      ],
    },
  },
  'ranking-data-honesty': {
    context: {
      RU: 'Один набор данных можно показать как абсолютную величину, как поправку на когорту и как категорию. Вопрос меняется — данные нет.',
      EN: 'One dataset can be shown as a raw magnitude, as a cohort-adjusted value and as a category. The question changes; the data does not.',
    },
    decision: {
      RU: 'Строка без базы для сравнения получает собственную полосу во всех трёх проекциях и никогда не попадает на график.',
      EN: 'A row with no comparable basis gets its own band in all three projections and never lands on the plot.',
    },
    consequence: {
      RU: 'Отсутствующее значение и ноль — разные факты, и график обычно эту разницу теряет. Здесь она сохраняется структурно: у неизвестных строк своя позиция, а не позиция нуля.',
      EN: 'A missing value and a zero are different facts, and a chart is where that difference is usually lost. Here it is kept structurally: unknown rows have their own position, not the position of zero.',
    },
    otherwise: {
      RU: 'Ноль вместо неизвестного читается как «дёшево» или «плохо», а не как «мы не знаем». На этом строятся решения, и ошибка становится невидимой.',
      EN: 'A zero standing in for unknown reads as cheap or bad rather than as we-do-not-know. Decisions get built on it, and the mistake becomes invisible.',
    },
    code: {
      file: 'apps/web/src/cases/projection.ts',
      language: 'typescript',
      lines: [
        '    if (!known) {',
        '      const parked = unknownPosition(unknownIndex, unknownTotal);',
        '      unknownIndex += 1;',
        '      return {',
        '        id: `r${index}`,',
        '        known,',
        '        selected: false,',
        '        positions: [parked, parked, parked],',
        '      };',
        '    }',
        '    // Absolute: raw magnitude, so most rows pile into one corner.',
        '    const absolute = { x: 14 + jitterX ** 3.4 * 70, y: 38 - jitterY ** 2.6 * 30 };',
        '    // Adjusted: the same rows against their own cohort, which spreads them.',
        '    const adjusted = { x: 14 + jitterX * 70, y: 38 - jitterY * 30 };',
        '    // Category: three explicit bands rather than a continuous score.',
        '    const band = Math.min(2, Math.floor(jitterY * 3));',
        '    const category = { x: 14 + jitterX * 70, y: 12 + band * 13 };',
      ],
    },
  },
  'search-cache-reliability': {
    context: {
      RU: 'Дорогой внешний провайдер и всплески одинаковых запросов: без защиты сотня одновременных промахов по одному ключу превращается в сотню вызовов.',
      EN: 'An expensive external provider and bursts of identical requests: unprotected, a hundred concurrent misses on one key become a hundred calls.',
    },
    decision: {
      RU: 'Свежее из кэша, иначе один загрузчик на все параллельные промахи, иначе устаревший снимок — и только если его нет, отказ.',
      EN: 'Fresh from the cache; otherwise one loader for all concurrent misses; otherwise the stale snapshot — and only if there is none, a refusal.',
    },
    consequence: {
      RU: 'Результат помечен полем stale. Вызывающая сторона видит не только данные, но и то, насколько им можно верить, и передаёт это в интерфейс.',
      EN: 'The result carries a stale flag. The caller sees not only the data but how far it can be trusted, and passes that on to the interface.',
    },
    otherwise: {
      RU: 'Без последней ветки отказ провайдера становится отказом продукта. Без флага stale устаревшие данные выдаются за свежие, а это хуже честной ошибки.',
      EN: 'Without the last branch a provider outage becomes a product outage. Without the stale flag, old data is served as if it were fresh, which is worse than an honest error.',
    },
    code: {
      file: 'apps/api/src/cache/cache.service.ts',
      language: 'typescript',
      lines: [
        '  async getOrLoad<T>(',
        '    key: string,',
        '    freshSeconds: number,',
        '    staleSeconds: number,',
        '    load: () => Promise<T>,',
        '  ): Promise<{ value: T; stale: boolean }> {',
        '    const cached = await this.read<T>(key);',
        '    const now = Date.now();',
        '    if (cached && cached.freshUntil > now) return { value: cached.value, stale: false };',
        '',
        '    try {',
        '      const value = await this.deduplicate(key, load);',
        '      await this.write(key, value, freshSeconds, staleSeconds);',
        '      return { value, stale: false };',
        '    } catch (error: unknown) {',
        '      if (cached && cached.staleUntil > now) return { value: cached.value, stale: true };',
        '      throw error;',
      ],
    },
  },
  'image-similarity': {
    context: {
      RU: 'Поиск похожего проходит через хранилище, эмбеддинги, векторный индекс и витрину. Отказ любого звена легко превращается в «нашлось ноль» без объяснения.',
      EN: 'Similarity search runs through storage, embeddings, a vector index and a warehouse. A failure at any link turns easily into zero results with no explanation.',
    },
    decision: {
      RU: 'Пустой запрос возвращает пустой список, а не весь каталог, отсортированный по случайному признаку.',
      EN: 'An empty query returns an empty list, not the whole catalogue sorted by something arbitrary.',
    },
    consequence: {
      RU: 'Граница между «ничего не подошло» и «подсистема не ответила» проводится на входе и не размывается дальше по пайплайну.',
      EN: 'The line between nothing-matched and a-subsystem-did-not-answer is drawn at the entry and is not blurred further down the pipeline.',
    },
    otherwise: {
      RU: 'Именно на этом стыке в проде однажды возникла нулевая выдача. Починка была не в перезапуске, а в том, чтобы каждое звено сообщало, что произошло именно у него.',
      EN: 'This is exactly the seam where a zero-result incident happened in production. The fix was not a restart but making every link report what actually happened to it.',
    },
    code: {
      file: 'services/semantic/app/ranking.py',
      language: 'python',
      lines: [
        'def rank(query: str, documents: list[Document], limit: int) -> list[tuple[Document, float]]:',
        '    if not query.strip() or not documents:',
        '        return []',
      ],
    },
  },
  'financial-concurrency': {
    context: {
      RU: 'Два процесса читают одно состояние и пишут по очереди. Без проверки версии второй молча затирает первого, и потеря видна только в сверке.',
      EN: 'Two processes read one state and write in turn. Without a version check the second silently overwrites the first, and the loss shows up only in reconciliation.',
    },
    decision: {
      RU: 'Запись выполняется только против той версии, которую читал клиент. Ноль затронутых строк — это конфликт, а не успех.',
      EN: 'The write only applies against the version the client read. Zero affected rows is a conflict, not a success.',
    },
    consequence: {
      RU: 'Конфликт возвращается кодом CONFLICT и статусом 409 — вызывающая сторона может перечитать и повторить. Ретраится сериализационный конфликт, но не ошибка домена.',
      EN: 'The conflict comes back as CONFLICT with a 409, so the caller can re-read and retry. A serialization conflict is retried; a domain error is not.',
    },
    otherwise: {
      RU: 'Тихо потерянная запись в денежном контуре не даёт ни ошибки, ни алерта. Она обнаруживается через недели, когда сходиться уже не с чем.',
      EN: 'A silently lost write in a money path raises no error and no alert. It surfaces weeks later, when there is nothing left to reconcile against.',
    },
    code: {
      file: 'apps/api/src/modules/portfolio/portfolio.service.ts',
      language: 'typescript',
      lines: [
        '      const result = await transaction.profile.updateMany({',
        '        where: { id: profile.id, version: input.expectedVersion },',
        '        data: { ...data, version: { increment: 1 } },',
        '      });',
        '      if (result.count !== 1) {',
        "        throw new GraphQLError('Profile was updated by another request', {",
        "          extensions: { code: 'CONFLICT', http: { status: 409 } },",
        '        });',
      ],
    },
  },
  'production-migration': {
    context: {
      RU: 'Миграция, которая проходит на машине разработчика с уже накопленной схемой, ничего не говорит о том, применится ли она к пустой базе.',
      EN: 'A migration that passes on a developer machine with an accumulated schema says nothing about whether it applies to an empty one.',
    },
    decision: {
      RU: 'Отдельный гейт поднимает чистую базу, применяет к ней все миграции с нуля и затем сид.',
      EN: 'A separate gate starts a clean database, applies every migration to it from zero, and then seeds.',
    },
    consequence: {
      RU: 'Гейт отделён от сборки: он падает до выката, а не во время него. Миграции аддитивные, поэтому предыдущий образ читает ту же схему во время переключения.',
      EN: 'The gate is separate from the build: it fails before a rollout rather than during one. Migrations are additive, so the previous image reads the same schema across the switch.',
    },
    otherwise: {
      RU: 'Без этого несовместимая миграция обнаруживается на проде, где откатывать приходится и схему, и трафик одновременно.',
      EN: 'Without it an incompatible migration is found in production, where both the schema and the traffic have to be rolled back at once.',
    },
    code: {
      file: '.github/workflows/migration-check.yml',
      language: 'yaml',
      lines: [
        '      - name: Start clean database',
        '        shell: bash',
        '        run: |',
        '          docker run --detach --name cockroach --publish 26257:26257 \\',
        '            cockroachdb/cockroach:v25.2.3 start-single-node --insecure',
        '          for attempt in {1..30}; do',
        "            docker exec cockroach cockroach sql --insecure --execute 'SELECT 1' >/dev/null 2>&1 && break",
        '            sleep 1',
        '          done',
        "          docker exec cockroach cockroach sql --insecure --execute 'SELECT 1'",
        '      - uses: ./.github/actions/setup',
        '      - run: pnpm prisma:validate',
        '      - run: pnpm db:migrate',
        '      - run: pnpm db:seed',
        '      - name: Prove all migrations are tracked',
      ],
    },
  },
};
