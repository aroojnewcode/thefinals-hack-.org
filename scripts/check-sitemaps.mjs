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

async function probe(url, expectStatus, expectXml) {
  try {
    const res = await fetch(url, {
      redirect: 'manual',
      headers: { 'User-Agent': 'thefinalshack-sitemap-check/1.0' },
    })
    const ct = res.headers.get('content-type') || ''
    const body = await res.text()
    if (res.status !== expectStatus) {
      fail(`${url} expected HTTP ${expectStatus}, got ${res.status}`)
      return
    }
    if (expectXml && !ct.includes('xml') && !body.trimStart().startsWith('<?xml')) {
      fail(`${url} expected XML, got ${ct || 'unknown type'}`)
    }
  } catch (err) {
    fail(`${url} fetch failed: ${err.message}`)
  }
}

console.log('Checking live sitemap endpoints…')
await probe(CANONICAL, 200, true)
await probe(`${SITE}/robots.txt`, 200, false)
await probe(`https://www.thefinalshack.org/sitemap.xml`, 301, false)
for (const path of LEGACY) {
  await probe(`${SITE}${path}`, 301, false)
}

if (failures.length) {
  console.error('Sitemap check failed:\n- ' + failures.join('\n- '))
  process.exit(1)
}

const locs = readFileSync(join(root, 'public', 'sitemap.xml'), 'utf8').match(/<loc>[^<]+<\/loc>/g) || []
console.log(`Sitemap OK: ${CANONICAL} (${locs.length} URLs) + ${LEGACY.length} legacy redirects`)
