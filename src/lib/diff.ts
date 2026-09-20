export interface DiffSegment {
  text: string;
  kind: 'same' | 'removed' | 'added';
}

function tokens(text: string): string[] {
  return text.match(/\S+\s*/g) ?? [];
}

/**
 * Word-level diff that keeps the common prefix and suffix and marks everything
 * between as removed and added. For a rule rewrite this reads far better than an
 * LCS diff, which fragments the change into single words.
 */
export function wordDiff(before: string, after: string): DiffSegment[] {
  const a = tokens(before);
  const b = tokens(after);
  let prefix = 0;
  while (prefix < a.length && prefix < b.length && a[prefix] === b[prefix]) prefix++;
  let suffix = 0;
  while (suffix < a.length - prefix && suffix < b.length - prefix && a[a.length - 1 - suffix] === b[b.length - 1 - suffix]) suffix++;
  const out: DiffSegment[] = [];
  const push = (list: string[], kind: DiffSegment['kind']) => {
    const text = list.join('');
    if (text) out.push({ text, kind });
  };
  push(a.slice(0, prefix), 'same');
  push(a.slice(prefix, a.length - suffix), 'removed');
  push(b.slice(prefix, b.length - suffix), 'added');
  push(a.slice(a.length - suffix), 'same');
  return out;
}
