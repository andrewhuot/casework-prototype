import { NavLink } from 'react-router-dom';
import { BarChart3, BookOpen, FlaskConical, FolderKanban, Inbox, MessageSquare } from 'lucide-react';
import { cx } from '@/lib/cx';
import { PrototypeTag } from './PrototypeTag';
import { REVIEWER_NAME } from '@/data/cases';
import styles from './SideNav.module.css';

const CASEWORK_ITEMS = [
  { to: '/', label: 'Queue', icon: Inbox, end: true },
  { to: '/rulebook', label: 'Rulebook', icon: BookOpen },
  { to: '/proving-ground', label: 'Proving ground', icon: FlaskConical },
  { to: '/scoreboard', label: 'Scoreboard', icon: BarChart3 },
];

/** Left navigation, 220 px. Chats and Projects are muted to show Casework lives inside the existing product. */
export function SideNav() {
  return (
    <nav className={styles.nav} aria-label="Primary">
      <div className={styles.brand}>
        <span className={styles.wordmark}>Claude</span>
      </div>
      <ul className={styles.list}>
        <li>
          <span className={cx(styles.item, styles.muted)} aria-disabled="true">
            <MessageSquare size={15} aria-hidden />
            Chats
          </span>
        </li>
        <li>
          <span className={cx(styles.item, styles.muted)} aria-disabled="true">
            <FolderKanban size={15} aria-hidden />
            Projects
          </span>
        </li>
      </ul>
      <div className={styles.groupLabel}>Casework</div>
      <ul className={styles.list}>
        {CASEWORK_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) => cx(styles.item, isActive && styles.active)}
              aria-current={undefined}
            >
              <Icon size={15} aria-hidden />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className={styles.footer}>
        <div className={styles.user}>
          <span className={styles.avatar} aria-hidden>
            JR
          </span>
          <span className={styles.userText}>
            <span className={styles.userName}>{REVIEWER_NAME}</span>
            <span className={styles.userRole}>Permit reviewer</span>
          </span>
        </div>
        <PrototypeTag />
      </div>
    </nav>
  );
}
