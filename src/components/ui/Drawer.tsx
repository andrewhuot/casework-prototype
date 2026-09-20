import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cx } from '@/lib/cx';
import { prefersReducedMotion } from '@/lib/motion';
import styles from './Drawer.module.css';

interface DrawerProps {
  open: boolean;
  title: ReactNode;
  eyebrow?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  /** Identifies the drawer content for tests and analytics-free instrumentation. */
  kind?: string;
}

/**
 * The one right-side drawer, 480 px wide. Built on the native dialog element so
 * focus stays inside, Escape closes it, and the rest of the page is inert.
 */
export function Drawer({ open, title, eyebrow, onClose, children, footer, kind }: DrawerProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
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
      headingRef.current?.focus();
    } else if (dialog.open) {
      const duration = prefersReducedMotion() ? 0 : 200;
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
      onClose();
    };
    dialog.addEventListener('cancel', onCancel);
    return () => dialog.removeEventListener('cancel', onCancel);
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      className={styles.drawer}
      aria-labelledby="drawer-title"
      data-drawer={kind}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.panel}>
        <header className={styles.header}>
          <div className={styles.headings}>
            {eyebrow && <div className={styles.eyebrow}>{eyebrow}</div>}
            <h2 id="drawer-title" ref={headingRef} tabIndex={-1} className={styles.title}>
              {title}
            </h2>
          </div>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
            <X size={16} aria-hidden />
          </button>
        </header>
        <div className={cx(styles.body)}>{children}</div>
        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>
    </dialog>
  );
}
