/**
 * Single sitemap at /sitemap.xml — every indexed page URL + image entries.
 * One urlset only (never a sitemap index). 404 is excluded.
 */
import { existsSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ALL_SITE_IMAGES } from './seo-site-images.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = join(root, 'public')
const dataDir = join(root, 'src', 'data')
const pagesDir = join(root, 'src', 'pages')
const SITE = (process.env.SITE_URL || 'https://thefinalshack.org').replace(/\/$/, '')
const TODAY = new Date().toLocaleDateString('en-CA')
const HREFLANG = ['en', 'x-default']

const HERO_FULL = '/media/dayz-hero-full.webp'
const COVER = '/media/dayz-cover.webp'
const PRODUCT_ESP = '/media/finals-esp-gameplay.webp'
const GAMEPLAY_TRAINING = '/media/finals-gameplay-training-range.webp'
const GAMEPLAY_ARENA = '/media/finals-gameplay-arena-elimination.webp'
const GAMEPLAY_OFFICE = '/media/finals-gameplay-office-esp.webp'
const BOX = '/media/finals-gameplay-red-grid-radar.webp'
const ESP = '/media/finals-gameplay-doorway-esp.webp'
const MENU = '/media/dayz-menu.gif'
const GAMEPLAY_LAB = '/media/finals-gameplay-laboratory-esp.webp'
const GAMEPLAY_DOORWAY = '/media/finals-gameplay-doorway-esp.webp'
const GAMEPLAY_RED = '/media/finals-gameplay-red-grid-radar.webp'
const VIDEO_THUMB = '/media/dayz-video-thumb.jpg'
const PREVIEW_VIDEO = '/videos/dayz-preview.mp4'
const OG_DEFAULT = '/og/the-finals-hack.jpg'

const FORUM_IMAGES = {
  'features-list': GAMEPLAY_ARENA,
  hotkeys: BOX,
  'complete-setup': GAMEPLAY_OFFICE,
  'disable-antivirus': GAMEPLAY_TRAINING,
  'undetected-status': GAMEPLAY_ARENA,
  'aimbot-settings': '/media/finals-gameplay-laboratory-esp.webp',
  'esp-wallhack-guide': ESP,
  'radar-hack-guide': GAMEPLAY_TRAINING,
  'stream-proof-setup': ESP,
  'easy-anti-cheat-status': PRODUCT_ESP,
  'windows-setup': PRODUCT_ESP,
  'raid-play-guide': BOX,
  'loader-errors': GAMEPLAY_OFFICE,
}

const PAGE_META = {
  '/': { priority: '1.0', changefreq: 'daily' },
  '/the-finals-hack': { priority: '0.9', changefreq: 'weekly' },
  '/forums': { priority: '0.85', changefreq: 'weekly' },
  '/reviews': { priority: '0.8', changefreq: 'weekly' },
  '/faq': { priority: '0.75', changefreq: 'monthly' },
  '/support': { priority: '0.75', changefreq: 'weekly' },
  '/privacy': { priority: '0.4', changefreq: 'yearly' },
  '/terms': { priority: '0.4', changefreq: 'yearly' },
  '/refunds': { priority: '0.45', changefreq: 'yearly' },
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

/** Keep captions ASCII-safe for maximum crawler compatibility. */
function asciiSafe(value) {
  return String(value)
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u2026/g, '...')
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, '')
}

function siteUrl(path) {
  return !path || path === '/' ? `${SITE}/` : `${SITE}${path.startsWith('/') ? path : `/${path}`}`
}

function loadGames() {
  const src = readFileSync(join(dataDir, 'games.ts'), 'utf8')
  return [...src.matchAll(/\{\s*slug:\s*['"]([^'"]+)['"],\s*name:\s*['"]([^'"]+)['"]/g)].map(
    (match) => ({ slug: match[1], name: match[2] }),
  )
}

function loadForums() {
  const src = readFileSync(join(dataDir, 'blogs.ts'), 'utf8')
  const pattern =
    /slug:\s*['"]([^'"]+)['"],\s*title:\s*['"]([^'"]+)['"],\s*excerpt:\s*['"]([^'"]+)['"],\s*metaTitle:\s*['"]([^'"]+)['"],\s*metaDescription:\s*['"]([^'"]+)['"],[\s\S]*?date:\s*['"](\d{4}-\d{2}-\d{2})['"]/g
  return [...src.matchAll(pattern)].map((match) => ({
    slug: match[1],
    title: match[2],
    excerpt: match[3],
    metaTitle: match[4],
    metaDescription: match[5],
    date: match[6],
  }))
}

function loadStaticRoutes() {
  return readdirSync(pagesDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.astro') && entry.name !== '404.astro')
    .map((entry) => (entry.name === 'index.astro' ? '/' : `/${entry.name.slice(0, -6)}`))
}

function alternateLinks(url) {
  return HREFLANG.map(
    (language) =>
      `    <xhtml:link rel="alternate" hreflang="${language}" href="${escapeXml(url)}" />`,
  ).join('\n')
}

function imageBlock({ src, title, caption }) {
  return `    <image:image>
      <image:loc>${escapeXml(siteUrl(src))}</image:loc>
      <image:title>${escapeXml(asciiSafe(title))}</image:title>
      <image:caption>${escapeXml(asciiSafe(caption))}</image:caption>
    </image:image>`
}

function videoBlock({ thumb, title, description, content }) {
  return `    <video:video>
      <video:thumbnail_loc>${escapeXml(siteUrl(thumb))}</video:thumbnail_loc>
      <video:title>${escapeXml(asciiSafe(title))}</video:title>
      <video:description>${escapeXml(asciiSafe(description))}</video:description>
      <video:content_loc>${escapeXml(siteUrl(content))}</video:content_loc>
      <video:family_friendly>yes</video:family_friendly>
      <video:live>no</video:live>
    </video:video>`
}

function urlEntry({ path, priority, changefreq, lastmod = TODAY, images, videos = [] }) {
  if (!images?.length) throw new Error(`Sitemap entry for ${path} is missing images`)
  const url = siteUrl(path)
  const media = [
    ...images.map((image) => imageBlock(image)),
    ...videos.map((video) => videoBlock(video)),
  ]
  return `  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${alternateLinks(url)}
${media.join('\n')}
  </url>`
}

function imagesForPath(path, games, forums) {
  if (path === '/') {
    return [
      {
        src: '/og/home.jpg',
        title: 'The Finals Hack Open Graph',
        caption: 'Google and social preview image for thefinalshack.org homepage.',
      },
      {
        src: HERO_FULL,
        title: 'The Finals Hack Hero',
        caption: 'Buy The Finals hack - THE FINALS Aimbot, ESP and radar hack hero artwork for PC.',
      },
      {
        src: PRODUCT_ESP,
        title: 'THE FINALS ESP Gameplay Screenshot',
        caption: 'In-game ESP wallhack preview with player box and skeleton overlay for The Finals hack.',
      },
      {
        src: VIDEO_THUMB,
        title: 'The Finals Hack Preview Thumbnail',
        caption: 'Thumbnail for the THE FINALS Aimbot and ESP preview video.',
      },
      {
        src: OG_DEFAULT,
        title: 'The Finals Hack Product Social Preview',
        caption: 'Default Open Graph image for thefinalshack.org product pages.',
      },
    ]
  }

  const game = games.find((g) => path === `/${g.slug}-hack`)
  if (game) {
    return [
      {
        src: '/og/the-finals-hack.jpg',
        title: 'The Finals Hack Open Graph',
        caption: 'Google and social preview for the The Finals hack product page.',
      },
      {
        src: PRODUCT_ESP,
        title: 'THE FINALS ESP Wallhack Gameplay',
        caption: 'THE FINALS first-person view with ESP bounding box and skeleton overlay.',
      },
      {
        src: HERO_FULL,
        title: `${game.name} Cheats Product Hero`,
        caption: `Hero artwork for ${game.name} Aimbot, ESP and radar hack product details.`,
      },
      {
        src: MENU,
        title: `${game.name} Cheats Menu Preview`,
        caption: `Menu and Aimbot settings preview for ${game.name} cheats.`,
      },
      {
        src: ESP,
        title: `${game.name} ESP Wallhack Screenshot`,
        caption: `THE FINALS player ESP with bounding box and skeleton overlay for ${game.name} cheats.`,
      },
      {
        src: VIDEO_THUMB,
        title: 'The Finals Hack Preview Thumbnail',
        caption: 'Thumbnail for the The Finals hack preview video.',
      },
    ]
  }

  if (path === '/forums') {
    return [
      {
        src: '/og/forums.jpg',
        title: 'The Finals Hack Forums Open Graph',
        caption: 'Google preview image for the The Finals Hack guides index.',
      },
      {
        src: MENU,
        title: 'The Finals Hack Forum Artwork',
        caption: 'Artwork reference for THE FINALS setup and feature guides.',
      },
    ]
  }

  if (path.startsWith('/forums/')) {
    const slug = path.slice('/forums/'.length)
    const forum = forums.find((f) => f.slug === slug)
    return [
      {
        src: `/og/forums-${slug}.jpg`,
        title: `${forum?.title || slug} Open Graph`,
        caption:
          forum?.metaDescription ||
          `Google preview image for ${forum?.title || slug} on thefinalshack.org.`,
      },
      {
        src: FORUM_IMAGES[slug] || MENU,
        title: `${forum?.title || slug} Artwork`,
        caption:
          forum?.excerpt ||
          `Visible The Finals Hack guide artwork for ${forum?.title || slug}.`,
      },
    ]
  }

  if (path === '/reviews') {
    return [
      {
        src: '/og/reviews.jpg',
        title: 'The Finals Hack Reviews Open Graph',
        caption: 'Google preview image for The Finals hack reviews.',
      },
    ]
  }
  if (path === '/faq') {
    return [
      {
        src: '/og/faq.jpg',
        title: 'The Finals Hack FAQ Open Graph',
        caption: 'Google preview image for the The Finals Hack FAQ.',
      },
    ]
  }
  if (path === '/support') {
    return [
      {
        src: '/og/support.jpg',
        title: 'The Finals Hack Support Open Graph',
        caption: 'Google preview image for The Finals Hack support.',
      },
    ]
  }
  if (path === '/privacy') {
    return [
      {
        src: '/og/privacy.jpg',
        title: 'The Finals Hack Privacy Policy',
        caption: 'Privacy policy preview for thefinalshack.org orders and support.',
      },
    ]
  }
  if (path === '/terms') {
    return [
      {
        src: '/og/terms.jpg',
        title: 'The Finals Hack Terms of Use',
        caption: 'License terms preview for The Finals Hack.',
      },
    ]
  }
  if (path === '/refunds') {
    return [
      {
        src: '/og/refunds.jpg',
        title: 'The Finals Hack Refund Policy',
        caption: 'Refund rules preview for digital The Finals Hack licenses.',
      },
    ]
  }

  return [{ src: OG_DEFAULT, title: 'The Finals Hack', caption: 'The Finals Hack page artwork.' }]
}

function videosForPath(path) {
  if (path === '/the-finals-hack') {
    return [
      {
        thumb: VIDEO_THUMB,
        title: 'The Finals Hack Aimbot and ESP Preview',
        description:
          'Self-hosted The Finals hack preview showing Aimbot, ESP menu and survival gameplay visuals on PC.',
        content: PREVIEW_VIDEO,
      },
    ]
  }
  return []
}

function collectAllPaths(games, forums, staticRoutes) {
  const paths = new Set([
    ...staticRoutes,
    ...games.map((game) => `/${game.slug}-hack`),
    ...forums.map((forum) => `/forums/${forum.slug}`),
  ])
  // Never index error page
  paths.delete('/404')
  return [...paths]
}

function buildSitemap(games, forums, allPaths) {
  const forumByPath = new Map(forums.map((f) => [`/forums/${f.slug}`, f]))

  const sorted = [...allPaths].sort((a, b) => {
    const rank = (path) => {
      if (path === '/') return 0
      if (path.endsWith('-hack')) return 1
      if (path === '/forums') return 2
      if (path.startsWith('/forums/')) return 3
      if (path === '/reviews') return 4
      if (path === '/faq') return 5
      if (path === '/support') return 6
      return 10
    }
    const diff = rank(a) - rank(b)
    return diff !== 0 ? diff : a.localeCompare(b)
  })

  const entries = sorted.map((path) => {
    const meta = PAGE_META[path] || {
      priority: path.startsWith('/forums/') ? '0.8' : '0.5',
      changefreq: path.startsWith('/forums/') ? 'monthly' : 'weekly',
    }
    const forum = forumByPath.get(path)
    return urlEntry({
      path,
      priority: meta.priority,
      changefreq: meta.changefreq,
      lastmod: forum?.date || TODAY,
      images: imagesForPath(path, games, forums),
      videos: videosForPath(path),
    })
  })

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${entries.join('\n')}
</urlset>
`
}

function validate(games, forums, allPaths, sitemap) {
  const errors = []
  if (forums.some((forum) => ['instructions', 'how-to-load'].includes(forum.slug))) {
    errors.push('Retired forum slug remains indexed')
  }
  for (const game of games) {
    const page = join(pagesDir, `${game.slug}-hack.astro`)
    if (!existsSync(page)) errors.push(`Product route has no page file: /${game.slug}-hack`)
  }
  if (forums.length && !existsSync(join(pagesDir, 'forums', '[slug].astro'))) {
    errors.push('Forum routes have no dynamic page file: src/pages/forums/[slug].astro')
  }
  for (const image of ALL_SITE_IMAGES) {
    const diskPath = join(publicDir, image.replace(/^\//, ''))
    if (!existsSync(diskPath)) errors.push(`Missing image asset on disk: ${image}`)
  }

  const expectedUrls = new Set(allPaths.map(siteUrl))
  const pageLocs = [...sitemap.matchAll(/<url>\s*<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
  const imageLocs = [...sitemap.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map((match) => match[1])
  const urlBlocks = sitemap.match(/<url>[\s\S]*?<\/url>/g) || []

  for (const url of expectedUrls) {
    if (!pageLocs.includes(url)) errors.push(`Missing URL: ${url}`)
  }
  for (const url of pageLocs) {
    if (!expectedUrls.has(url)) errors.push(`Unexpected URL: ${url}`)
  }
  if (new Set(pageLocs).size !== pageLocs.length) errors.push('sitemap.xml contains duplicate page URLs')
  if (sitemap.includes('<sitemapindex')) errors.push('sitemap.xml must be a single urlset, not an index')
  if ((sitemap.match(/<urlset[\s>]/g) || []).length !== 1) {
    errors.push('sitemap.xml must contain exactly one <urlset>')
  }
  if (urlBlocks.length !== expectedUrls.size) {
    errors.push(`Expected ${expectedUrls.size} <url> entries, found ${urlBlocks.length}`)
  }
  for (const block of urlBlocks) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1] || '(unknown)'
    if (!block.includes('<image:image>') || !block.includes('<image:loc>')) {
      errors.push(`URL missing image entry: ${loc}`)
    }
  }
  for (const image of ALL_SITE_IMAGES) {
    if (!imageLocs.includes(siteUrl(image))) errors.push(`Sitemap missing required image: ${image}`)
  }
  if (!sitemap.includes(siteUrl(PREVIEW_VIDEO))) {
    errors.push('Sitemap missing THE FINALS preview video content_loc')
  }
  if (/Tarkov|tarkovcheats|EFT Reaper|Warzone|warzonecheats|Ricochet/i.test(sitemap)) {
    errors.push('Sitemap still contains legacy Tarkov/Warzone labels')
  }
  if (!sitemap.includes('thefinalshack.org')) {
    errors.push('Sitemap must target thefinalshack.org')
  }
  if (/tarkovcheats|warzonecheats|wardogshacks|theisle/i.test(sitemap)) {
    errors.push('Sitemap contains a non-THE FINALS domain')
  }
  if (imageLocs.length < expectedUrls.size) {
    errors.push('Image count is lower than page count - every URL needs an image')
  }
  if (/[^\x09\x0A\x0D\x20-\x7E]/.test(sitemap.replace(/https?:\/\//g, ''))) {
    // Allow non-ascii only inside https URLs if any; captions should be ascii.
  }
  if (errors.length) throw new Error(`Sitemap validation failed:\n- ${errors.join('\n- ')}`)
}

function main() {
  const games = loadGames()
  const forums = loadForums()
  const staticRoutes = loadStaticRoutes()
  const allPaths = collectAllPaths(games, forums, staticRoutes)
  const sitemap = buildSitemap(games, forums, allPaths)
  validate(games, forums, allPaths, sitemap)

  writeFileSync(join(publicDir, 'sitemap.xml'), sitemap, 'utf8')
  writeFileSync(
    join(publicDir, 'robots.txt'),
    [
      'User-agent: Googlebot',
      'Allow: /',
      'Allow: /sitemap.xml',
      'Allow: /robots.txt',
      'Allow: /media/',
      'Allow: /og/',
      'Allow: /videos/',
      '',
      'User-agent: Google-InspectionTool',
      'Allow: /',
      'Allow: /sitemap.xml',
      'Allow: /robots.txt',
      'Allow: /media/',
      'Allow: /og/',
      'Allow: /videos/',
      '',
      'User-agent: Bingbot',
      'Allow: /',
      'Allow: /sitemap.xml',
      'Allow: /robots.txt',
      'Allow: /media/',
      'Allow: /og/',
      'Allow: /videos/',
      '',
      'User-agent: *',
      'Allow: /',
      'Allow: /sitemap.xml',
      'Allow: /robots.txt',
      'Allow: /media/',
      'Allow: /og/',
      'Allow: /videos/',
      'Disallow: /404',
      'Disallow: /404.html',
      '',
      `Sitemap: ${siteUrl('/sitemap.xml')}`,
      '',
    ].join('\n'),
    'utf8',
  )

  for (const name of [
    'sitemap-pages.xml',
    'sitemap-products.xml',
    'sitemap-forums.xml',
    'sitemap-images.xml',
    'sitemap-blogs.xml',
    'sitemap-regions.xml',
    'sitemap-index.xml',
    'sitemap_index.xml',
  ]) {
    for (const dir of [publicDir, join(root, 'dist')]) {
      const path = join(dir, name)
      if (existsSync(path)) unlinkSync(path)
    }
  }

  console.log(
    `Sitemap OK: ${allPaths.length} pages in single sitemap.xml (${siteUrl('/sitemap.xml')})`,
  )
}

main()
