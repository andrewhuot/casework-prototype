import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '@/lib/cx';
import styles from './Card.module.css';

export function Card({ children, className, padded = true, ...rest }: { children: ReactNode; className?: string; padded?: boolean } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cx(styles.card, padded && styles.padded, className)} {...rest}>
      {children}
    </div>
  );
}

export function SectionLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx(styles.sectionLabel, className)}>{children}</div>;
}
