/** "email", "email and text message", "email, text message, and virtual agent call". */
export function listWithAnd(items: string[]): string {
  if (items.length <= 2) return items.join(' and ');
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}
