import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cx } from '@/lib/cx';
import { Button, type ButtonProps } from './Button';
import styles from './Menu.module.css';

export interface MenuItemDef {
  id: string;
  label: ReactNode;
  onSelect: () => void;
  danger?: boolean;
  description?: ReactNode;
}

interface MenuProps {
  label: ReactNode;
  items: MenuItemDef[];
  buttonProps?: Partial<ButtonProps>;
  align?: 'left' | 'right';
  className?: string;
}

/** A small dropdown menu with arrow-key navigation. */
export function Menu({ label, items, buttonProps, align = 'right', className }: MenuProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    const el = listRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]')[activeIndex];
    el?.focus();
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open, activeIndex]);

  const select = (item: MenuItemDef) => {
    setOpen(false);
    buttonRef.current?.focus();
    item.onSelect();
  };

  return (
    <div ref={wrapperRef} className={cx(styles.wrapper, className)}>
      <Button
        ref={buttonRef}
        iconRight={ChevronDown}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => {
          setActiveIndex(0);
          setOpen((v) => !v);
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex(e.key === 'ArrowDown' ? 0 : items.length - 1);
            setOpen(true);
          }
        }}
        {...buttonProps}
      >
        {label}
      </Button>
      {open && (
        <ul
          ref={listRef}
          id={id}
          role="menu"
          className={cx(styles.menu, align === 'right' ? styles.right : styles.left)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.preventDefault();
              setOpen(false);
              buttonRef.current?.focus();
            } else if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActiveIndex((i) => (i + 1) % items.length);
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActiveIndex((i) => (i - 1 + items.length) % items.length);
            } else if (e.key === 'Tab') {
              setOpen(false);
            }
          }}
        >
          {items.map((item, index) => (
            <li key={item.id} role="none">
              <button
                type="button"
                role="menuitem"
                tabIndex={index === activeIndex ? 0 : -1}
                className={cx(styles.item, item.danger && styles.danger)}
                onClick={() => select(item)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <span className={styles.itemLabel}>{item.label}</span>
                {item.description && <span className={styles.itemDescription}>{item.description}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
