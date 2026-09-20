import { FlaskConical } from 'lucide-react';
import styles from './PrototypeTag.module.css';

export const PROTOTYPE_TAG_TEXT = 'Prototype. Synthetic data. Rules are illustrative. Not affiliated with the City of Miami.';

/** Always visible. Synthetic-data honesty for anyone who opens the share link. */
export function PrototypeTag() {
  return (
    <p className={styles.tag} data-prototype-tag>
      <FlaskConical size={13} aria-hidden className={styles.icon} />
      <span>{PROTOTYPE_TAG_TEXT}</span>
    </p>
  );
}
