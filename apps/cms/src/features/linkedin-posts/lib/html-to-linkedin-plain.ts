/**
 * Convert TipTap HTML to plain text suitable for pasting into LinkedIn.
 */
export function htmlToLinkedInPlain(html: string): string {
  if (typeof document === 'undefined') {
    return stripHtmlFallback(html);
  }
  const root = document.createElement('div');
  root.innerHTML = html;

  function textFromNode(node: Node, depth: number): string {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent ?? '';
    }
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return '';
    }
    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();
    if (tag === 'br') return '\n';
    const children = Array.from(el.childNodes);
    const inner = children.map((c) => textFromNode(c, depth + 1)).join('');
    if (tag === 'p' || tag === 'div') return `${inner}\n`;
    if (tag.startsWith('h')) return `\n${inner.trim()}\n\n`;
    if (tag === 'li') return `\n• ${inner.trim()}`;
    if (tag === 'ul' || tag === 'ol') return `${inner}\n`;
    if (tag === 'blockquote') return `\n${inner.trim()}\n\n`;
    return inner;
  }

  const raw = textFromNode(root, 0);
  return raw
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+\n/g, '\n')
    .trim();
}

function stripHtmlFallback(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|h[1-6]|li|tr)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
