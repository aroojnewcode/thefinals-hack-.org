/**
 * Host redirects for legacy Pages Functions (if invoked).
 * Canonical host is apex — always 301 www → non-www over HTTPS.
 */
export async function onRequest(context) {
  const url = new URL(context.request.url)

  if (url.protocol === 'http:') {
    url.protocol = 'https:'
  }

  const host = url.hostname.toLowerCase()
  if (host.startsWith('www.')) {
    url.hostname = host.slice(4)
    url.protocol = 'https:'
    return Response.redirect(url.toString(), 301)
  }

  if (url.protocol === 'http:') {
    url.protocol = 'https:'
    return Response.redirect(url.toString(), 301)
  }

  return context.next()
}
