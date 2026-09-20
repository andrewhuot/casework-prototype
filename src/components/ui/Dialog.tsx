import { useEffect, useId, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cx } from '@/lib/cx';
import { prefersReducedMotion } from '@/lib/motion';
import styles from './Dialog.module.css';

interface DialogProps {
  open: boolean;
  title: ReactNode;
  description?: ReactNode;
  onClose: () => void;
  children?: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  /** Confirmations that need a response. */
  alert?: boolean;
  /** Prevents dismissal by Escape or backdrop, for short non-cancellable progress. */
  locked?: boolean;
  hideClose?: boolean;
  kind?: string;
}

/** Centred modal dialog on the native dialog element. */
export function Dialog({ open, title, description, onClose, children, footer, size = 'md', alert, locked, hideClose, kind }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descId = useId();
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open) {
      if (closeTimer.current) {
        window.clearTimeout(closeTimer.current);
        closeTimer.current = null;
        dialog.classList.remove(styles.closing ?? '');
      }
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      const duration = prefersReducedMotion() ? 0 : 150;
      dialog.classList.add(styles.closing ?? '');
      closeTimer.current = window.setTimeout(() => {
        dialog.classList.remove(styles.closing ?? '');
        dialog.close();
        closeTimer.current = null;
      }, duration);
    }
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const onCancel = (e: Event) => {
      e.preventDefault();
      if (!locked) onClose();
    };
    dialog.addEventListener('cancel', onCancel);
    return () => dialog.removeEventListener('cancel', onCancel);
  }, [onClose, locked]);

  return (
    <dialog
      ref={ref}
      className={cx(styles.dialog, styles[size])}
      role={alert ? 'alertdialog' : undefined}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      data-dialog={kind}
      onClick={(e) => {
        if (!locked && e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        // Escape closes. Handled here as well as through the native cancel event,
        // which some environments do not fire for synthetic key presses.
        if (e.key === 'Escape') {
          e.preventDefault();
          e.stopPropagation();
          if (!locked) onClose();
        }
      }}
    >
      <div className={styles.panel}>
        <header className={styles.header}>
          <div className={styles.headings}>
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
            {description && (
              <p id={descId} className={styles.description}>
                {description}
              </p>
            )}
          </div>
          {!hideClose && !locked && (
            <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
              <X size={16} aria-hidden />
            </button>
          )}
        </header>
        {children && <div className={styles.body}>{children}</div>}
        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>
    </dialog>
  );
}
