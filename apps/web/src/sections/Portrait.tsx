import { useEffect, useRef, useState } from 'react';
import type { SiteCopy } from '../content/site-copy';

const SOURCE = `${import.meta.env.BASE_URL}profile.jpg`;

/**
 * The portrait, and a way to see it properly.
 *
 * On a wide screen it is a column of the manifesto and needs nothing. On a
 * phone that same column is the full width of the device, so the photograph
 * became a screen of its own that a reader had to scroll past to reach the
 * text it belongs to. It is a thumbnail there instead, and tapping it opens
 * the full frame — the detail is still available, it just stops being the
 * loudest thing on the page.
 *
 * A native `<dialog>` again, for the reasons `CaseDialog` gives: the focus
 * trap, the inert background and Escape are the platform's rather than ours.
 */
export function Portrait({ copy }: { copy: SiteCopy }): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const node = dialog.current;
    if (!node || !open) return;
    const onClose = (): void => setOpen(false);
    node.addEventListener('close', onClose);
    node.showModal();
    return () => {
      node.removeEventListener('close', onClose);
      node.close();
    };
  }, [open]);

  return (
    <figure className="manifesto__portrait">
      <button
        aria-label={copy.manifesto.portrait}
        className="manifesto__portrait-open"
        onClick={() => setOpen(true)}
        type="button"
      >
        <img alt="Сергей Кутушев" height="640" loading="lazy" src={SOURCE} width="512" />
      </button>
      <figcaption className="t-meta-sm">
        <span>Sergey Kutushev</span>
        <span>Saint Petersburg · UTC+3</span>
      </figcaption>

      {open && (
        <dialog
          aria-label={copy.manifesto.portrait}
          className="portrait-view"
          onClick={() => dialog.current?.close()}
          ref={dialog}
        >
          <img alt="Сергей Кутушев" height="640" src={SOURCE} width="512" />
        </dialog>
      )}
    </figure>
  );
}
