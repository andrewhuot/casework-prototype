import { Outlet } from 'react-router-dom';
import { SideNav } from './SideNav';
import { TopBar } from './TopBar';
import { ToastRegion } from '@/components/ui/Toast';
import { DrawerHost } from '@/components/drawers/DrawerHost';
import { useStore } from '@/app/store';
import styles from './AppShell.module.css';

export function AppShell() {
  const toasts = useStore((s) => s.toasts);
  const dismissToast = useStore((s) => s.dismissToast);
  return (
    <div className={styles.shell}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <SideNav />
      <div className={styles.column}>
        <TopBar />
        <main id="main" className={styles.main} tabIndex={-1}>
          <Outlet />
        </main>
      </div>
      <DrawerHost />
      <ToastRegion toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
