import { useStore } from '@/app/store';
import { Drawer } from '@/components/ui/Drawer';
import { CASES_BY_ID } from '@/data/cases';
import { PRECEDENTS_BY_ID } from '@/data/precedents';
import { SOURCES_BY_ID } from '@/data/sources';
import { SOURCE_TYPE_META } from '@/components/ui/Chip';
import { SourceViewer } from './SourceViewer';
import { PastDecision } from './PastDecision';
import { DecisionRecord } from './DecisionRecord';
import { LetterPreview } from './LetterPreview';

/** Mounts the one drawer and picks its content from the store. */
export function DrawerHost() {
  const drawer = useStore((s) => s.drawer);
  const closeDrawer = useStore((s) => s.closeDrawer);
  const sources = useStore((s) => s.sources);

  let title = '';
  let eyebrow: string | undefined;
  let body: React.ReactNode = null;

  if (drawer?.kind === 'source') {
    const source = sources.find((r) => r.source.id === drawer.sourceId)?.source ?? SOURCES_BY_ID[drawer.sourceId];
    title = source?.name ?? drawer.sourceId;
    eyebrow = source ? `Source ${source.id} · ${SOURCE_TYPE_META[source.type].label}` : undefined;
    body = <SourceViewer sourceId={drawer.sourceId} section={drawer.section} />;
  } else if (drawer?.kind === 'precedent') {
    const precedent = PRECEDENTS_BY_ID[drawer.precedentId];
    title = precedent?.id ?? drawer.precedentId;
    eyebrow = 'Past decision · Closed cases 2024 to 2025';
    body = <PastDecision precedentId={drawer.precedentId} />;
  } else if (drawer?.kind === 'record') {
    const meta = CASES_BY_ID[drawer.caseId];
    title = 'Decision record';
    eyebrow = meta ? `${meta.id} · ${meta.applicant}` : drawer.caseId;
    body = <DecisionRecord caseId={drawer.caseId} />;
  } else if (drawer?.kind === 'letter') {
    const meta = CASES_BY_ID[drawer.caseId];
    title = drawer.language === 'es' ? 'Letter preview: Spanish copy' : 'Letter preview';
    eyebrow = meta ? `${meta.id} · ${meta.ownerName}` : drawer.caseId;
    body = <LetterPreview caseId={drawer.caseId} language={drawer.language} text={drawer.text} />;
  }

  return (
    <Drawer open={drawer !== null} title={title} eyebrow={eyebrow} onClose={closeDrawer} kind={drawer?.kind}>
      {body}
    </Drawer>
  );
}
