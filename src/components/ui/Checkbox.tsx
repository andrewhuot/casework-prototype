import { useId, type ReactNode } from 'react';
import { Check } from 'lucide-react';
import { cx } from '@/lib/cx';
import styles from './Checkbox.module.css';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: ReactNode;
  disabled?: boolean;
  className?: string;
  name?: string;
}

export function Checkbox({ checked, onChange, label, disabled, className, name }: CheckboxProps) {
  const id = useId();
  return (
    <label htmlFor={id} className={cx(styles.label, disabled && styles.disabled, className)}>
      <span className={styles.control}>
        <input id={id} name={name} type="checkbox" className={styles.input} checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
        <span className={cx(styles.box, checked && styles.checked)} aria-hidden>
          <Check size={12} strokeWidth={3} />
        </span>
      </span>
      <span className={styles.text}>{label}</span>
    </label>
  );
}
