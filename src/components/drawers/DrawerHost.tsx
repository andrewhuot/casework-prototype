import { useStore } from '@/app/store';
import { Drawer } from '@/components/ui/Drawer';

/** Mounts the one drawer and picks its content from the store. */
export function DrawerHost() {
  const drawer = useStore((s) => s.drawer);
  const closeDrawer = useStore((s) => s.closeDrawer);
  return (
    <Drawer open={drawer !== null} title={drawer?.kind ?? ''} onClose={closeDrawer} kind={drawer?.kind}>
      {drawer && <p>Drawer: {drawer.kind}</p>}
    </Drawer>
  );
}
