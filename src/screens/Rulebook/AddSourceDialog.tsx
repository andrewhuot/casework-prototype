import { useEffect, useState } from 'react';
import { FileUp, Link2 } from 'lucide-react';
import { useStore } from '@/app/store';
import { SOURCES_BY_ID } from '@/data/sources';
import type { Source, SourceType } from '@/data/types';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { RadioGroup, SelectField, TextField } from '@/components/ui/Field';
import { DEMO_DATE } from '@/lib/dates';
import styles from './AddSourceDialog.module.css';

interface AddSourceDialogProps {
  open: boolean;
  onClose: () => void;
}

/** Nothing is parsed or sent. "Add" closes the dialog and adds a row with the status "Processing" for two seconds. */
export function AddSourceDialog({ open, onClose }: AddSourceDialogProps) {
  const addSource = useStore((s) => s.addSource);
  const sources = useStore((s) => s.sources);
  const [mode, setMode] = useState<'upload' | 'link'>('upload');
  const [name, setName] = useState('');
  const [type, setType] = useState<SourceType>('regulation');
  const [link, setLink] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setMode('upload');
      setName('');
      setType('regulation');
      setLink('');
      setError(null);
    }
  }, [open]);

  const example = SOURCES_BY_ID.R6;
  const r6Added = sources.some((s) => s.source.id === 'R6');

  const loadExample = () => {
    if (!example) return;
    setMode('link');
    setName(example.name);
    setType(example.type);
    setLink(example.link ?? '');
    setError(null);
  };

  const submit = () => {
    if (name.trim().length === 0) {
      setError('Give the source a name.');
      return;
    }
    const isExample = example && name.trim() === example.name && !r6Added;
    const nextNumber = Math.max(...sources.map((s) => Number(s.source.id.replace(/\D/g, '')) || 0), 6) + 1;
    const source: Source = isExample
      ? { ...example, added: DEMO_DATE }
      : {
          id: `R${nextNumber}`,
          name: name.trim(),
          type,
          added: DEMO_DATE,
          usedFor: [],
          sections: [],
          ...(mode === 'link' && link ? { link } : {}),
        };
    addSource(source);
    onClose();
  };

  return (
    <Dialog
      open={open}
      title="Add source"
      description="Add a document the city relies on. Claude reads it and proposes any criteria changes for a person to approve."
      onClose={onClose}
      size="sm"
      kind="add-source"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={submit} data-add-confirm>
            Add
          </Button>
        </>
      }
    >
      <div className={styles.stack}>
        <RadioGroup
          label="Source"
          name="source-mode"
          value={mode}
          onChange={(v) => setMode(v as 'upload' | 'link')}
          options={[
            { value: 'upload', label: 'Upload file' },
            { value: 'link', label: 'Paste link' },
          ]}
        />
        {mode === 'upload' ? (
          <div className={styles.dropzone} aria-label="File upload, simulated">
            <FileUp size={18} aria-hidden className={styles.dropIcon} />
            <span>Drop a PDF here or choose a file. Uploads are simulated in this prototype.</span>
          </div>
        ) : (
          <TextField label="Link" type="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://" data-source-link />
        )}
        <TextField label="Name" required value={name} onChange={(e) => setName(e.target.value)} error={error} placeholder="For example: Fire Marshal bulletin 2026-03" data-source-name />
        <SelectField label="Type" value={type} onChange={(e) => setType(e.target.value as SourceType)}>
          <option value="regulation">Regulation</option>
          <option value="internal_manual">Internal manual</option>
          <option value="prior_decisions">Prior decisions</option>
        </SelectField>
        <div className={styles.exampleRow}>
          <Link2 size={13} aria-hidden />
          <Button variant="link" size="sm" onClick={loadExample} disabled={r6Added} data-load-example>
            Load example
          </Button>
          <span className={styles.exampleHint}>{r6Added ? 'The example bulletin is already in the library.' : 'Fills in the Fire Marshal bulletin 2026-03 as a linked regulation.'}</span>
        </div>
      </div>
    </Dialog>
  );
}
