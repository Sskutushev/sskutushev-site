import { ArrowUpRight, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { SiteCopy } from '../content/site-copy';
import type { Locale } from '../lib/portfolio';
import type { CaseNote } from './case-notes';

const OWNER = 'https://github.com/Sskutushev';

/**
 * Drop the indentation every line shares.
 *
 * The excerpt is stored exactly as the file has it, which is what the checks
 * assert and what the link goes to. Displayed that way, a slice from three
 * levels deep spends a third of the panel on empty margin and pushes the
 * comments — the most informative lines in it — off the right edge. Removing
 * only the common prefix keeps the shape of the code, which is the part that
 * carries meaning, and costs nothing a reader was using.
 */
function dedent(lines: string[]): string {
  const indents = lines
    .filter((line) => line.trim().length > 0)
    .map((line) => line.length - line.trimStart().length);
  const common = indents.length ? Math.min(...indents) : 0;
  return lines.map((line) => line.slice(common)).join('\n');
}

/**
 * Where the excerpt can be read in full.
 *
 * A note from another repository is pinned to a commit rather than to a
 * branch: the point of showing code is that a reviewer can check it, and a
 * branch link stops being a check the moment the branch moves.
 */
function sourceUrl(code: CaseNote['code']): string {
  return code.repository
    ? `${OWNER}/${code.repository.name}/blob/${code.repository.commit}/${code.file}`
    : `${OWNER}/sskutushev-site/blob/main/${code.file}`;
}

/**
 * The reasoning behind one case, with the code that carries it.
 *
 * A native `<dialog>` opened with `showModal`, so the focus trap, the inert
 * background and Escape are the platform's rather than ours — three things
 * hand-rolled modals reliably get wrong.
 */
export function CaseDialog({
  copy,
  locale,
  note,
  title,
  onClose,
}: {
  copy: SiteCopy;
  locale: Locale;
  note: CaseNote;
  title: string;
  onClose: () => void;
}): React.JSX.Element {
  const dialog = useRef<HTMLDialogElement>(null);
  // Read through a ref so the effect below can depend on nothing. See the
  // comment inside it: re-running that effect closes the dialog on open.
  const close = useRef(onClose);
  close.current = onClose;

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    // `close()` queues its event rather than dispatching it, so the one queued
    // by a cleanup arrives after the next mount has already reopened the
    // dialog. React's development mode mounts every effect twice on purpose to
    // surface exactly this, and the dialog was closing itself a tick after it
    // opened. A close event only means something when the dialog is shut.
    const onDialogClose = (): void => {
      if (!node.open) close.current();
    };
    // `close` covers Escape, the close button and a backdrop click alike, so
    // there is one path back out rather than three.
    node.addEventListener('close', onDialogClose);
    node.showModal();
    return () => {
      node.removeEventListener('close', onDialogClose);
      node.close();
    };
    // The dependency list is deliberately empty. `HTMLDialogElement.close()`
    // *queues* the close event rather than dispatching it, so a cleanup that
    // closes followed by an immediate re-run that reopens leaves the queued
    // event to land on the listener the re-run just attached — the dialog
    // closed itself a frame after opening. Nothing read inside changes: the
    // callback is reached through a ref for exactly this reason.
  }, []);

  const rows = [
    { label: copy.caseNote.context, value: note.context[locale] },
    { label: copy.caseNote.decision, value: note.decision[locale] },
    { label: copy.caseNote.consequence, value: note.consequence[locale] },
    { label: copy.caseNote.otherwise, value: note.otherwise[locale] },
  ];

  return (
    <dialog
      aria-labelledby="case-note-title"
      className="note"
      onClick={(event) => {
        // The backdrop is the dialog element itself; a click landing on it
        // rather than on the panel is a click outside.
        if (event.target === dialog.current) dialog.current.close();
      }}
      ref={dialog}
    >
      <div className="note__panel">
        <header className="note__head">
          <h2 className="t-h3" id="case-note-title">
            {title}
          </h2>
          <button
            aria-label={copy.caseNote.close}
            className="icon-button"
            onClick={() => dialog.current?.close()}
            type="button"
          >
            <X aria-hidden size={18} strokeWidth={1.5} />
          </button>
        </header>

        <div className="note__body">
          <dl className="note__rows">
            {rows.map((row) => (
              <div key={row.label}>
                <dt className="t-meta-sm">{row.label}</dt>
                <dd className="t-body">{row.value}</dd>
              </div>
            ))}
          </dl>

          <figure className="note__code">
            <figcaption className="t-meta-sm">
              <a href={sourceUrl(note.code)} rel="noreferrer" target="_blank">
                {note.code.repository
                  ? `${note.code.repository.name} · ${note.code.file}`
                  : note.code.file}
                <ArrowUpRight aria-hidden size={13} strokeWidth={1.5} />
              </a>
            </figcaption>
            <pre>
              <code>{dedent(note.code.lines)}</code>
            </pre>
          </figure>
        </div>
      </div>
    </dialog>
  );
}
