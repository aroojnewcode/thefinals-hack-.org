/**
 * Smoke-test canonical + legacy sitemap URLs (local files + live production).
 * Run: npm run check:sitemaps
 */
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = join(import.meta.dirname, '..')
const SITE = 'https://thefinalshack.org'
const CANONICAL = `${SITE}/sitemap.xml`

const LEGACY = [
  '/sitemap-pages.xml',
  '/sitemap-products.xml',
  '/sitemap-forums.xml',
  '/sitemap-images.xml',
  '/sitemap-blogs.xml',
  '/sitemap-regions.xml',
  '/sitemap-index.xml',
  '/sitemap_index.xml',
  '/sitemap.xml/',
]

const failures = []
function fail(msg) {
  failures.push(msg)
}

for (const file of ['public/sitemap.xml', 'dist/sitemap.xml']) {
  const path = join(root, file)
  if (!existsSync(path)) fail(`Missing ${file} — run npm run build`)
  else {
    const xml = readFileSync(path, 'utf8')
    if (!xml.startsWith('<?xml')) fail(`${file} is not valid XML`)
    const locs = xml.match(/<loc>[^<]+<\/loc>/g) || []
    if (locs.length < 20) fail(`${file} has too few URLs (${locs.length})`)
  }
}

const robots = join(root, 'public', 'robots.txt')
if (!readFileSync(robots, 'utf8').includes(`Sitemap: ${CANONICAL}`)) {
  fail('robots.txt must declare canonical sitemap URL')
}

async function probeRedirect(url, expectedLocation) {
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'manual',
      headers: { 'User-Agent': 'thefinalshack-sitemap-check/1.0' },
    })
    if (res.status !== 301) {
      fail(`${url} expected HTTP 301 to apex sitemap, got ${res.status}`)
      return
    }
    const location = res.headers.get('location') || ''
    if (location !== expectedLocation) {
      fail(`${url} expected Location: ${expectedLocation}, got ${location || '(missing)'}`)
    }
  } catch (err) {
    fail(`${url} redirect probe failed: ${err.message}`)
  }
}

async function probe(url, expectStatus, expectXml, method = 'GET') {
  try {
    const res = await fetch(url, {
      method,
      redirect: 'manual',
      headers: { 'User-Agent': 'thefinalshack-sitemap-check/1.0' },
    })
    const ct = res.headers.get('content-type') || ''
    const body = method === 'HEAD' ? '' : await res.text()
    if (res.status !== expectStatus) {
      fail(`${url} (${method}) expected HTTP ${expectStatus}, got ${res.status}`)
      return
    }
    if (expectXml && method === 'GET' && !ct.includes('xml') && !body.trimStart().startsWith('<?xml')) {
      fail(`${url} expected XML, got ${ct || 'unknown type'}`)
    }
    if (expectXml && method === 'HEAD' && !ct.includes('xml')) {
      fail(`${url} HEAD must return XML content-type, got ${ct || 'unknown type'}`)
    }
  } catch (err) {
    fail(`${url} fetch failed: ${err.message}`)
  }
}

const GOOGLEBOT = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'

async function probeGooglebot(url, method) {
  try {
    const res = await fetch(url, {
      method,
      redirect: 'manual',
      headers: { 'User-Agent': GOOGLEBOT },
    })
    const ct = res.headers.get('content-type') || ''
    if (res.status !== 200) {
      fail(`Googlebot ${method} ${url} expected HTTP 200, got ${res.status}`)
      return
    }
    if (!ct.includes('xml')) {
      fail(`Googlebot ${method} ${url} expected XML content-type, got ${ct || 'unknown'}`)
      return
    }
    if (method === 'GET') {
      const body = await res.text()
      if (!body.trimStart().startsWith('<?xml')) {
        fail(`Googlebot GET ${url} body is not XML`)
      }
      if (!body.includes('<loc>https://thefinalshack.org/</loc>')) {
        fail(`Googlebot GET ${url} returned an empty or invalid sitemap (no homepage <loc>)`)
      }
      const urlCount = (body.match(/<url>/g) || []).length
      if (urlCount < 20) {
        fail(`Googlebot GET ${url} must list all pages (found ${urlCount} <url> entries)`)
      }
      if (body.includes('<image:') || body.includes('xmlns:image')) {
        fail(`Googlebot GET ${url} must be a page-only sitemap (no image extension)`)
      }
    }
  } catch (err) {
    fail(`Googlebot ${method} ${url} failed: ${err.message}`)
  }
}

console.log('Checking live sitemap endpoints…')
await probe(CANONICAL, 200, true)
await probe(CANONICAL, 200, true, 'HEAD')
await probeGooglebot(CANONICAL, 'HEAD')
await probeGooglebot(CANONICAL, 'GET')
await probe(`${SITE}/robots.txt`, 200, false)
await probeRedirect(`https://www.thefinalshack.org/sitemap.xml`, CANONICAL)
await probeRedirect(`http://thefinalshack.org/sitemap.xml`, CANONICAL)
for (const path of LEGACY) {
  await probe(`${SITE}${path}`, 301, false)
}

const xml = readFileSync(join(root, 'public', 'sitemap.xml'), 'utf8')
const pageUrls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
console.log(`Checking ${pageUrls.length} page URLs from sitemap…`)
for (const pageUrl of pageUrls) {
  try {
    const res = await fetch(pageUrl, {
      redirect: 'follow',
      headers: { 'User-Agent': 'thefinalshack-sitemap-check/1.0' },
    })
    if (res.status !== 200) fail(`${pageUrl} returned HTTP ${res.status}`)
  } catch (err) {
    fail(`${pageUrl} fetch failed: ${err.message}`)
  }
}

if (failures.length) {
  console.error('Sitemap check failed:\n- ' + failures.join('\n- '))
  process.exit(1)
}

const locs = readFileSync(join(root, 'public', 'sitemap.xml'), 'utf8').match(/<loc>[^<]+<\/loc>/g) || []
console.log(`Sitemap OK: ${CANONICAL} (${locs.length} URLs) + ${LEGACY.length} legacy redirects`)
