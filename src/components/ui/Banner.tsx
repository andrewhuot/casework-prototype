import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Info, Sparkles, TriangleAlert, X } from 'lucide-react';
import { cx } from '@/lib/cx';
import styles from './Banner.module.css';

interface BannerProps {
  tone?: 'info' | 'hint' | 'warning' | 'success';
  icon?: LucideIcon;
  children: ReactNode;
  onDismiss?: () => void;
  className?: string;
  action?: ReactNode;
}

const ICONS: Record<NonNullable<BannerProps['tone']>, LucideIcon> = {
  info: Info,
  hint: Sparkles,
  warning: TriangleAlert,
  success: Info,
};

/** An inline message bar. Used for the first-visit hint, warnings, and notes. */
export function Banner({ tone = 'info', icon, children, onDismiss, className, action }: BannerProps) {
  const Icon = icon ?? ICONS[tone];
  return (
    <div className={cx(styles.banner, styles[tone], className)}>
      <Icon size={15} className={styles.icon} aria-hidden />
      <div className={styles.text}>{children}</div>
      {action}
      {onDismiss && (
        <button type="button" className={styles.dismiss} onClick={onDismiss} aria-label="Dismiss">
          <X size={14} aria-hidden />
        </button>
      )}
    </div>
  );
}
