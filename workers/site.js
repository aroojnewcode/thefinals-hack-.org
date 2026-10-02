/**
 * Worker entry for Astro static output in ./dist.
 * IMPORTANT: Always fetch assets via https://assets.local — never the request
 * hostname — or Cloudflare returns HTTP 522 on custom domains.
 *
 * Canonical host is apex (no www). Always 301 www → apex so crawlers never
 * see duplicate content or mismatched canonical/hreflang on www.
 */
function assetsFetch(env, request, pathname) {
  return env.ASSETS.fetch(new Request(new URL(pathname, 'https://assets.local'), request))
}

function withHtmlCharset(response) {
  const contentType = response.headers.get('content-type') || ''
  const primary = contentType.split(',')[0].trim()
  if (!primary.toLowerCase().startsWith('text/html')) return response
  if (/charset=/i.test(primary)) {
    if (contentType.includes(',')) {
      const headers = new Headers(response.headers)
      headers.set('content-type', primary)
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      })
    }
    return response
  }
  const headers = new Headers(response.headers)
  headers.set('content-type', 'text/html; charset=utf-8')
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

/** Prefer apex: https://www.example.com/path → https://example.com/path */
function toApexUrl(url) {
  const host = url.hostname.toLowerCase()
  if (!host.startsWith('www.')) return null
  const next = new URL(url.toString())
  next.hostname = host.slice(4)
  next.protocol = 'https:'
  return next
}

const SEO_ASSETS = {
  '/sitemap.xml': 'application/xml; charset=utf-8',
  '/robots.txt': 'text/plain; charset=utf-8',
  '/sitemap.css': 'text/css; charset=utf-8',
}

const LEGACY_SITEMAP_PATHS = new Set([
  '/sitemap-pages.xml',
  '/sitemap-products.xml',
  '/sitemap-forums.xml',
  '/sitemap-images.xml',
  '/sitemap-blogs.xml',
  '/sitemap-regions.xml',
  '/sitemap-index.xml',
  '/sitemap_index.xml',
])

function apexSitemapUrl(pathname) {
  return `https://thefinalshack.org${pathname.startsWith('/') ? pathname : `/${pathname}`}`
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.protocol === 'http:') {
      url.protocol = 'https:'
      const apex = toApexUrl(url)
      return Response.redirect((apex || url).toString(), 301)
    }

    const apex = toApexUrl(url)
    if (apex) {
      return Response.redirect(apex.toString(), 301)
    }

    if (LEGACY_SITEMAP_PATHS.has(url.pathname) || url.pathname === '/sitemap.xml/') {
      return Response.redirect(apexSitemapUrl('/sitemap.xml'), 301)
    }

    const seoType = SEO_ASSETS[url.pathname]
    if (seoType) {
      const assetPath = url.pathname === '/sitemap.xml/' ? '/sitemap.xml' : url.pathname
      const seoResponse = await assetsFetch(env, request, assetPath + url.search)
      const headers = new Headers(seoResponse.headers)
      headers.set('Content-Type', seoType)
      headers.set('X-Content-Type-Options', 'nosniff')
      headers.delete('Link')
      if (!headers.has('Cache-Control')) {
        headers.set('Cache-Control', 'public, max-age=3600')
      }
      return new Response(seoResponse.body, {
        status: seoResponse.status,
        statusText: seoResponse.statusText,
        headers,
      })
    }

    const assetResponse = await assetsFetch(env, request, url.pathname + url.search)
    const response = withHtmlCharset(assetResponse)

    // Help crawlers + Seobility: advertise preferred host + self-canonical
    const headers = new Headers(response.headers)
    if (!headers.has('Strict-Transport-Security')) {
      headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
    }
    const contentType = headers.get('content-type') || ''
    if (contentType.includes('text/html')) {
      const canonical = `https://${url.hostname}${url.pathname === '/' ? '/' : url.pathname.replace(/\/$/, '') || '/'}`
      const existing = headers.get('Link')
      const linkCanonical = `<${canonical}>; rel="canonical"`
      headers.set('Link', existing ? `${existing}, ${linkCanonical}` : linkCanonical)
    }
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    })
  },
}
