import { useEffect, useRef, useState } from 'react';
import { CircleCheck, Info, X } from 'lucide-react';
import { cx } from '@/lib/cx';
import { prefersReducedMotion } from '@/lib/motion';
import type { ToastItem } from '@/app/store';
import styles from './Toast.module.css';

interface ToastRegionProps {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
}

/** Confirmations are short toasts at the bottom right. */
export function ToastRegion({ toasts, onDismiss }: ToastRegionProps) {
  return (
    <div className={styles.region} aria-live="polite" aria-relevant="additions">
      {toasts.map((toast) => (
        <ToastView key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastView({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: number) => void }) {
  const duration = toast.duration ?? 4000;
  const [remaining, setRemaining] = useState(duration);
  const startedAt = useRef(performance.now());
  const done = useRef(false);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    let frame = 0;
    let interval = 0;
    const finish = () => {
      if (done.current) return;
      done.current = true;
      toast.onExpire?.();
      onDismiss(toast.id);
    };
    const tick = () => {
      const left = Math.max(0, duration - (performance.now() - startedAt.current));
      setRemaining(left);
      if (left <= 0) finish();
      else frame = requestAnimationFrame(tick);
    };
    if (reduced) {
      interval = window.setInterval(() => {
        const left = Math.max(0, duration - (performance.now() - startedAt.current));
        setRemaining(left);
        if (left <= 0) {
          window.clearInterval(interval);
          finish();
        }
      }, 1000);
    } else {
      frame = requestAnimationFrame(tick);
    }
    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(interval);
    };
  }, [duration, onDismiss, toast]);

  const Icon = toast.kind === 'info' ? Info : CircleCheck;
  const fraction = remaining / duration;

  return (
    <div className={cx(styles.toast, toast.action && styles.withAction)} role="status" data-toast>
      <div className={styles.row}>
        <Icon size={16} className={cx(styles.icon, toast.kind === 'info' ? styles.iconInfo : styles.iconSuccess)} aria-hidden />
        <div className={styles.message}>{toast.message}</div>
        {toast.action && (
          <button
            type="button"
            className={styles.action}
            onClick={() => {
              done.current = true;
              toast.action?.onClick();
              onDismiss(toast.id);
            }}
          >
            {toast.action.label}
            {toast.action.label === 'Undo' && <span className={cx(styles.seconds, 'tnum')}>{Math.ceil(remaining / 1000)}s</span>}
          </button>
        )}
        <button
          type="button"
          className={styles.dismiss}
          aria-label="Dismiss"
          onClick={() => {
            done.current = true;
            toast.onExpire?.();
            onDismiss(toast.id);
          }}
        >
          <X size={14} aria-hidden />
        </button>
      </div>
      {toast.action && (
        <div className={styles.track} aria-hidden>
          <div className={styles.bar} style={{ transform: `scaleX(${fraction})` }} />
        </div>
      )}
    </div>
  );
}
