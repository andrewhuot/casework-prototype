import type { DocBlock, Packet, PacketDocument, PacketEntry } from '@/data/types';
import { formatDate } from './dates';

/** The searchable lines of one block. Drawings carry no searchable text. */
export function blockLines(block: DocBlock): string[] {
  switch (block.type) {
    case 'heading':
    case 'para':
      return [block.text];
    case 'field':
      return [`${block.label}: ${block.value}`];
    case 'fields':
      return block.items.map((f) => `${f.label}: ${f.value}`);
    case 'list':
      return block.items;
    case 'drawing':
      return [];
    case 'signature':
      return [`Signed: ${block.name}, ${block.role}, ${formatDate(block.date)}`];
    case 'notary':
      return [block.text];
    case 'seal':
      return [block.text];
  }
}

export function documentText(doc: PacketDocument): string {
  return doc.blocks.flatMap(blockLines).join('\n');
}

export function isProvided(entry: PacketEntry): entry is PacketDocument {
  return !entry.missing;
}

export function providedDocuments(packet: Packet): PacketDocument[] {
  return packet.documents.filter(isProvided);
}

export function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

export function documentWordCount(doc: PacketDocument): number {
  return wordCount(documentText(doc));
}

export function packetWordCount(packet: Packet): number {
  return providedDocuments(packet).reduce((sum, doc) => sum + documentWordCount(doc), 0);
}

export interface QuoteLocation {
  blockIndex: number;
  lineIndex: number;
  start: number;
  end: number;
}

/** Exact, case-sensitive substring search inside a single line of a document. */
export function findQuote(doc: PacketDocument, quote: string): QuoteLocation | null {
  for (let blockIndex = 0; blockIndex < doc.blocks.length; blockIndex++) {
    const block = doc.blocks[blockIndex];
    if (!block) continue;
    const lines = blockLines(block);
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex] ?? '';
      const start = line.indexOf(quote);
      if (start >= 0) return { blockIndex, lineIndex, start, end: start + quote.length };
    }
  }
  return null;
}

export interface Range {
  start: number;
  end: number;
  key: string;
}

export interface Segment {
  text: string;
  key?: string;
}

/** Splits a line into plain and highlighted segments. Ranges must not overlap. */
export function splitByRanges(text: string, ranges: Range[]): Segment[] {
  const sorted = [...ranges].sort((a, b) => a.start - b.start);
  const out: Segment[] = [];
  let cursor = 0;
  for (const r of sorted) {
    if (r.start < cursor) continue;
    if (r.start > cursor) out.push({ text: text.slice(cursor, r.start) });
    out.push({ text: text.slice(r.start, r.end), key: r.key });
    cursor = r.end;
  }
  if (cursor < text.length) out.push({ text: text.slice(cursor) });
  return out;
}
