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
  '/sitemap.xml': 'text/xml; charset=utf-8',
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

function seoHeaders(seoType, sourceHeaders) {
  const headers = new Headers(sourceHeaders)
  headers.set('Content-Type', seoType)
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('Access-Control-Allow-Origin', '*')
  headers.delete('Link')
  if (!headers.has('Cache-Control')) {
    headers.set('Cache-Control', 'public, max-age=3600')
  }
  return headers
}

async function serveSeoAsset(env, request, assetPath, seoType) {
  const seoResponse = await assetsFetch(env, request, assetPath + new URL(request.url).search)
  const headers = seoHeaders(seoType, seoResponse.headers)

  if (!seoResponse.ok) {
    return new Response(seoResponse.statusText || 'Not Found', {
      status: seoResponse.status,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  }

  // Google Search Console and many crawlers probe with HEAD first — empty body is valid.
  if (request.method === 'HEAD') {
    return new Response(null, {
      status: seoResponse.status,
      statusText: seoResponse.statusText,
      headers,
    })
  }

  const body = await seoResponse.arrayBuffer()

  return new Response(body, {
    status: seoResponse.status,
    statusText: seoResponse.statusText,
    headers,
  })
}

async function handleRequest(request, env) {
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

  // /sitemap.xml and /robots.txt are static assets (see wrangler.toml). Worker only handles legacy aliases.
  const seoType =
    url.pathname === '/sitemap.css' ? SEO_ASSETS['/sitemap.css'] : undefined
  if (seoType) {
    return serveSeoAsset(env, request, url.pathname, seoType)
  }

  const assetResponse = await assetsFetch(env, request, url.pathname + url.search)
  const response = withHtmlCharset(assetResponse)

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
}

export default {
  async fetch(request, env) {
    try {
      return await handleRequest(request, env)
    } catch (error) {
      console.error('Worker error:', error)
      const path = new URL(request.url).pathname
      return new Response('Internal Server Error', { status: 500 })
    }
  },
}
