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
    /**
     * Which of Sergey's public repositories the excerpt is from. Omitted for
     * this one, whose files the unit test reads from disk. Anything else is
     * pinned to a commit, so the link a reviewer follows shows the same lines
     * however far that repository moves afterwards, and
     * `scripts/check-quoted-code.mjs` fetches it at that commit to prove it.
     */
    repository?: { name: string; commit: string };
    /** Repository-relative path. Asserted to contain the excerpt verbatim. */
    file: string;
    language: string;
    lines: string[];
  };
}

/**
 * The commits the quoted repositories are pinned at. Named here rather than
 * repeated per note: two excerpts from one repository must be read at the same
 * revision, or the page shows two states of a codebase that never coexisted.
 */
const PINNED = {
  'PM-GROWTH': '51a3455c9bacdadb0fbaa6d496e5f257f7b2e740',
  'Power-Test': 'f8185713e3e9cb0dc88a3fdef75b13ff78577da2',
} as const;

/**
 * What each case actually decided, and the code that decides it.
 *
 * Every excerpt is a verbatim slice of a file in this repository, and
 * `case-notes.spec.ts` fails when it stops being one. Code that drifts out of
 * agreement with the system it illustrates is worse than no code at all: it
 * reads as evidence while being decoration.
 *
 * Nothing from a private codebase is quoted. Where a case has a public
 * implementation in another of Sergey's repositories, that is what is shown:
 * an excerpt written for this site to illustrate work done elsewhere argues
 * the same point with weaker evidence.
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
      RU: 'Дорогой внешний провайдер с квотой и всплески одинаковых запросов: без защиты сотня одновременных промахов по одному ключу превращается в сотню вызовов.',
      EN: 'An expensive external provider on a quota, and bursts of identical requests: unprotected, a hundred concurrent misses on one key become a hundred calls.',
    },
    decision: {
      RU: 'Свежее из кэша, иначе один загрузчик на все параллельные промахи, иначе последний удачный снимок — и только если его нет, отказ.',
      EN: 'Fresh from the cache; otherwise one loader for all concurrent misses; otherwise the last good snapshot — and only if there is none, a refusal.',
    },
    consequence: {
      RU: 'Снимок возвращается с поднятым IsStale, а не молча. Вызывающая сторона видит не только данные, но и то, насколько им можно верить, и доносит это до интерфейса. Отдельный счётчик считает, как часто это происходит.',
      EN: 'The snapshot comes back with IsStale raised rather than silently. The caller sees not only the data but how far it can be trusted, and carries that to the interface. A counter says how often it happens.',
    },
    otherwise: {
      RU: 'Без ветки со снимком отказ провайдера становится отказом продукта. Без флага устаревшие данные выдаются за свежие, а это хуже честной ошибки. Без throw в конце пустой кэш притворился бы ответом.',
      EN: 'Without the snapshot branch a provider outage becomes a product outage. Without the flag, old data is served as if it were fresh, which is worse than an honest error. Without the throw at the end an empty cache would pass itself off as an answer.',
    },
    code: {
      repository: { name: 'Power-Test', commit: PINNED['Power-Test'] },
      file: 'src/Weather.Infrastructure/WeatherApi/CachingWeatherProvider.cs',
      language: 'csharp',
      lines: [
        '        try',
        '        {',
        '            return await cache.GetOrCreateAsync(',
        '                cacheKey,',
        '                async token =>',
        '                {',
        '                    WeatherTelemetry.CacheMisses.Add(1, new KeyValuePair<string, object?>("cache", "dashboard"));',
        '                    return await RefreshAsync(location, forecastDays, token);',
        '                },',
        '                entryOptions,',
        '                tags: ["weather"],',
        '                cancellationToken);',
        '        }',
        '        catch (WeatherProviderException exception)',
        '        {',
        '            WeatherSnapshot? stale = await cache.TryGetAsync<WeatherSnapshot>(StaleKeyFor(location), CancellationToken.None);',
        '',
        '            if (stale is null)',
        '            {',
        '                throw;',
        '            }',
        '',
        '            WeatherTelemetry.StaleServed.Add(1, new KeyValuePair<string, object?>("cache", "dashboard"));',
        '            logger.LogWarning(exception, "weather_stale_served {StaleSince}", stale.StaleSince);',
        '',
        '            return stale with { IsStale = true };',
        '        }',
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
      RU: 'Две правки одной записи в системе, где часы превращаются в деньги. Обе прочитали одно состояние, пишут по очереди — и без проверки версии вторая молча затирает первую. Потеря видна только в сверке.',
      EN: 'Two edits to one record in a system where hours become money. Both read the same state and write in turn, and without a version check the second silently overwrites the first. The loss shows up only in reconciliation.',
    },
    decision: {
      RU: 'Версия стоит в самом фильтре, поэтому проверка и запись атомарны. Ноль совпавших документов — это конфликт, а не успех, и вызывающая сторона превращает его в 409.',
      EN: 'The version sits in the filter itself, so the check and the write are one atomic step. Zero matched documents is a conflict, not a success, and the caller turns it into a 409.',
    },
    consequence: {
      RU: 'Дневной инвариант держится через ту же транзакцию: прежние часы освобождаются до того, как забронированы новые, поэтому правка внутри одного дня не удваивает бронь на одном и том же документе-счётчике.',
      EN: 'The daily invariant holds through the same transaction: the old hours are released before the new ones are booked, so an edit inside one day does not double-book against the same counter document.',
    },
    otherwise: {
      RU: 'Тихо потерянная запись в денежном контуре не даёт ни ошибки, ни алерта. Она обнаруживается через недели, когда сходиться уже не с чем. А бронь без освобождения переполнила бы день на правке, которая часов не добавляла.',
      EN: 'A silently lost write in a money path raises no error and no alert. It surfaces weeks later, when there is nothing left to reconcile against. And booking without releasing would overflow the day on an edit that added no hours at all.',
    },
    code: {
      repository: { name: 'PM-GROWTH', commit: PINNED['PM-GROWTH'] },
      file: 'backend/src/Timesheet.Infrastructure/MongoTimesheetStore.cs',
      language: 'csharp',
      lines: [
        '        // The version sits in the filter, so the check and the write are atomic in Mongo.',
        '        var filter = Builders<BsonDocument>.Filter.Eq("_id", entry.Id)',
        '            & Builders<BsonDocument>.Filter.Eq("version", expectedVersion);',
        '',
        '        TimeEntry? replaced = null;',
        '',
        '        await InTransaction(async session =>',
        '        {',
        '            var current = await Entries.Find(session, filter).FirstOrDefaultAsync(ct);',
        '',
        '            if (current is null)',
        '            {',
        '                // Somebody else got there first: the caller turns this into a 409.',
        '                replaced = null;',
        '                return;',
        '            }',
        '',
        '            // Release what the entry used to hold before booking what it holds now: the day may',
        '            // be the same one, and then both operations land on the same guard document.',
        '            await MongoDailyHoursGuard.Release(database, session, MongoMapping.Entry(current), ct);',
        '            await MongoDailyHoursGuard.Reserve(database, session, entry, ct);',
        '',
        '            var result = await Entries.ReplaceOneAsync(',
        '                session,',
        '                filter,',
        '                MongoMapping.Entry(entry),',
        '                cancellationToken: ct);',
        '',
        '            replaced = result.MatchedCount == 1 ? entry : null;',
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
