/**
 * Renderiza o corpo do post (HTML gerado pela IA) com sanitização básica:
 * remove script/style/iframe, atributos on* (handlers) e URLs javascript: para evitar XSS.
 * Estilização via classe .prose (globals.css).
 */
function sanitize(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/(href|src)\s*=\s*("|')\s*javascript:[^"']*\2/gi, '$1=$2#$2')
}

export default function PostContent({ html }: { html: string }) {
  return (
    <div
      className="prose max-w-none space-y-5 text-lg leading-relaxed text-ink-soft"
      dangerouslySetInnerHTML={{ __html: sanitize(html) }}
    />
  )
}
