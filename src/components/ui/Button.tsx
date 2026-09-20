import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { cx } from '@/lib/cx';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'link';
export type ButtonSize = 'sm' | 'md';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconRight?: LucideIcon;
  loading?: boolean;
  /** Keeps the button focusable while it cannot be used, so its hint can be read. */
  softDisabled?: boolean;
  children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'secondary', size = 'md', icon: Icon, iconRight: IconRight, loading, softDisabled, className, children, type = 'button', onClick, ...rest },
  ref,
) {
  const iconSize = size === 'sm' ? 14 : 15;
  return (
    <button
      ref={ref}
      type={type}
      className={cx(styles.button, styles[variant], styles[size], loading && styles.loading, className)}
      aria-disabled={softDisabled || undefined}
      onClick={softDisabled ? (e) => e.preventDefault() : onClick}
      {...rest}
    >
      {loading ? <Loader2 size={iconSize} className={styles.spinner} aria-hidden /> : Icon ? <Icon size={iconSize} aria-hidden /> : null}
      {children && <span className={styles.label}>{children}</span>}
      {IconRight ? <IconRight size={iconSize} aria-hidden /> : null}
    </button>
  );
});
