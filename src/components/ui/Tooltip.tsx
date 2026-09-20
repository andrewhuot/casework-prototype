import { useId, type ReactNode } from 'react';
import { cx } from '@/lib/cx';
import styles from './Tooltip.module.css';

interface TooltipProps {
  text: string;
  children: ReactNode;
  /** When the child is not itself focusable, the wrapper takes focus so keyboard users can reach the tooltip. */
  focusable?: boolean;
  className?: string;
  placement?: 'bottom' | 'top';
}

/** A small hover/focus tooltip. The trigger is described by the tooltip text. */
export function Tooltip({ text, children, focusable = true, className, placement = 'bottom' }: TooltipProps) {
  const id = useId();
  return (
    <span className={cx(styles.wrapper, className)} tabIndex={focusable ? 0 : undefined} aria-describedby={id}>
      {children}
      <span role="tooltip" id={id} className={cx(styles.bubble, styles[placement])}>
        {text}
      </span>
    </span>
  );
}
