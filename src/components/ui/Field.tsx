import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cx } from '@/lib/cx';
import styles from './Field.module.css';

interface FieldShellProps {
  label: ReactNode;
  helper?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  className?: string;
  children: (ids: { id: string; describedBy: string | undefined }) => ReactNode;
  inline?: boolean;
}

function FieldShell({ label, helper, error, required, className, children, inline }: FieldShellProps) {
  const id = useId();
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;
  const describedBy = [helper ? helperId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;
  return (
    <div className={cx(styles.field, inline && styles.inline, className)}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden>
            *
          </span>
        )}
      </label>
      {children({ id, describedBy })}
      {helper && (
        <div id={helperId} className={styles.helper}>
          {helper}
        </div>
      )}
      {error && (
        <div id={errorId} className={styles.error} role="alert">
          {error}
        </div>
      )}
    </div>
  );
}

type Shell = Omit<FieldShellProps, 'children'>;

export const TextField = forwardRef<HTMLInputElement, Shell & InputHTMLAttributes<HTMLInputElement>>(function TextField(
  { label, helper, error, required, className, inline, ...input },
  ref,
) {
  return (
    <FieldShell label={label} helper={helper} error={error} required={required} className={className} inline={inline}>
      {({ id, describedBy }) => <input ref={ref} id={id} className={cx(styles.input, error ? styles.invalid : undefined)} aria-describedby={describedBy} aria-invalid={error ? true : undefined} required={required} {...input} />}
    </FieldShell>
  );
});

export const TextArea = forwardRef<HTMLTextAreaElement, Shell & TextareaHTMLAttributes<HTMLTextAreaElement>>(function TextArea(
  { label, helper, error, required, className, inline, ...input },
  ref,
) {
  return (
    <FieldShell label={label} helper={helper} error={error} required={required} className={className} inline={inline}>
      {({ id, describedBy }) => <textarea ref={ref} id={id} className={cx(styles.input, styles.textarea, error ? styles.invalid : undefined)} aria-describedby={describedBy} aria-invalid={error ? true : undefined} required={required} {...input} />}
    </FieldShell>
  );
});

export const SelectField = forwardRef<HTMLSelectElement, Shell & SelectHTMLAttributes<HTMLSelectElement>>(function SelectField(
  { label, helper, error, required, className, inline, children, ...select },
  ref,
) {
  return (
    <FieldShell label={label} helper={helper} error={error} required={required} className={className} inline={inline}>
      {({ id, describedBy }) => (
        <select ref={ref} id={id} className={cx(styles.input, styles.select)} aria-describedby={describedBy} required={required} {...select}>
          {children}
        </select>
      )}
    </FieldShell>
  );
});

interface RadioGroupProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: ReactNode }[];
  className?: string;
}

export function RadioGroup({ label, name, value, onChange, options, className }: RadioGroupProps) {
  return (
    <fieldset className={cx(styles.fieldset, className)}>
      <legend className={styles.label}>{label}</legend>
      <div className={styles.radios}>
        {options.map((opt) => (
          <label key={opt.value} className={cx(styles.radio, value === opt.value && styles.radioSelected)}>
            <input type="radio" name={name} value={opt.value} checked={value === opt.value} onChange={() => onChange(opt.value)} className={styles.radioInput} />
            <span className={styles.radioDot} aria-hidden />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
