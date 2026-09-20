import { Link, useNavigate } from 'react-router-dom';
import { Landmark, RotateCcw } from 'lucide-react';
import { useStore } from '@/app/store';
import { DEPARTMENT_NAME } from '@/data/cases';
import { Button } from '@/components/ui/Button';
import { PROTOTYPE_TAG_TEXT } from './PrototypeTag';
import { FlaskConical } from 'lucide-react';
import styles from './TopBar.module.css';

/** Department name, current rulebook version, and Reset demo. */
export function TopBar() {
  const version = useStore((s) => s.rulebookVersion);
  const reset = useStore((s) => s.reset);
  const pushToast = useStore((s) => s.pushToast);
  const navigate = useNavigate();
  return (
    <header className={styles.bar}>
      <div className={styles.department}>
        <Landmark size={15} aria-hidden className={styles.icon} />
        <span>{DEPARTMENT_NAME}</span>
      </div>
      <p className={styles.compactTag} data-prototype-tag-compact>
        <FlaskConical size={12} aria-hidden />
        <span>{PROTOTYPE_TAG_TEXT}</span>
      </p>
      <div className={styles.right}>
        <Link to="/rulebook" className={styles.version} data-rulebook-version>
          Rulebook v{version}
        </Link>
        <Button
          variant="ghost"
          size="sm"
          icon={RotateCcw}
          onClick={() => {
            reset();
            navigate('/');
            pushToast({ message: 'Demo reset to its starting state.', kind: 'info' });
          }}
        >
          Reset demo
        </Button>
      </div>
    </header>
  );
}
