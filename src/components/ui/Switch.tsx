import { useId } from 'react';
import { cx } from '@/lib/cx';
import styles from './Switch.module.css';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
  /** Visible text beside the switch; defaults to On/Off. */
  showState?: boolean;
  className?: string;
}

export function Switch({ checked, onChange, label, disabled, showState = true, className }: SwitchProps) {
  const id = useId();
  return (
    <span className={cx(styles.wrapper, className)}>
      <button
        type="button"
        role="switch"
        id={id}
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        className={cx(styles.switch, checked && styles.on)}
        onClick={() => onChange(!checked)}
      >
        <span className={styles.knob} aria-hidden />
      </button>
      {showState && (
        <span className={cx(styles.state, disabled && styles.stateDisabled)} aria-hidden>
          {checked ? 'On' : 'Off'}
        </span>
      )}
    </span>
  );
}
