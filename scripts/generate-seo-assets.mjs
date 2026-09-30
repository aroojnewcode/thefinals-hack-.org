/**
 * Auto-generate 1200x630 JPEG Open Graph images for every indexed URL.
 * Google SERP / social crawlers fetch these for right-side thumbnails.
 * Never overwrites battlelog-sourced /media assets.
 */
import { access, mkdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const ogDir = join(root, 'public', 'og')
const mediaDir = join(root, 'public', 'media')
const blogsPath = join(root, 'src', 'data', 'blogs.ts')

await mkdir(ogDir, { recursive: true })
await mkdir(mediaDir, { recursive: true })

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

async function exists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

const requiredBattlelog = [
  join(mediaDir, 'dayz-hero-full.webp'),
  join(mediaDir, 'dayz-cover.webp'),
  join(mediaDir, 'finals-esp-gameplay.webp'),
  join(mediaDir, 'finals-gameplay-training-range.webp'),
  join(mediaDir, 'finals-gameplay-doorway-esp.webp'),
  join(mediaDir, 'finals-gameplay-arena-elimination.webp'),
  join(mediaDir, 'finals-gameplay-laboratory-esp.webp'),
  join(mediaDir, 'finals-gameplay-red-grid-radar.webp'),
  join(mediaDir, 'finals-gameplay-office-esp.webp'),
  join(mediaDir, 'dayz-box.jpg'),
  join(mediaDir, 'dayz-menu.gif'),
  join(mediaDir, 'dayz-esp-gameplay.gif'),
  join(mediaDir, 'dayz-video-thumb.jpg'),
]

for (const path of requiredBattlelog) {
  if (!(await exists(path))) {
    throw new Error(`Missing THE FINALS media asset (do not regenerate): ${path}`)
  }
}

function overlaySvg(width, height, eyebrow, title, subtitle) {
  const titleSize = Math.min(54, Math.round(width * 0.042))
  const lines = String(title).match(/.{1,28}(\s|$)/g)?.map((s) => s.trim()).filter(Boolean) || [
    title,
  ]
  const titleLines = lines.slice(0, 2)
  return Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shade" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="#08060f" stop-opacity="0.55"/>
          <stop offset="0.45" stop-color="#08060f" stop-opacity="0.72"/>
          <stop offset="1" stop-color="#14081f" stop-opacity="0.88"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#shade)"/>
      <text x="64" y="210" fill="#c084fc" font-size="22" font-family="Arial, sans-serif" font-weight="700" letter-spacing="4">${escapeXml(eyebrow)}</text>
      ${titleLines
        .map(
          (line, i) =>
            `<text x="64" y="${290 + i * 64}" fill="#ffffff" font-size="${titleSize}" font-family="Arial, sans-serif" font-weight="700">${escapeXml(line)}</text>`,
        )
        .join('\n')}
      <text x="64" y="480" fill="#c9bdd2" font-size="26" font-family="Arial, sans-serif">${escapeXml(subtitle)}</text>
      <text x="64" y="560" fill="#9299a3" font-size="20" font-family="Arial, sans-serif">thefinalshack.org</text>
    </svg>
  `)
}

async function writeOgJpeg(outPath, sourcePath, eyebrow, title, subtitle) {
  const base = sharp(sourcePath).resize(1200, 630, { fit: 'cover', position: 'centre' })
  const overlay = sharp(overlaySvg(1200, 630, eyebrow, title, subtitle))
  await sharp({
    create: { width: 1200, height: 630, channels: 3, background: '#08060f' },
  })
    .composite([
      { input: await base.toBuffer(), top: 0, left: 0 },
      { input: await overlay.png().toBuffer(), top: 0, left: 0 },
    ])
    .jpeg({ quality: 90, chromaSubsampling: '4:4:4', mozjpeg: true })
    .toFile(outPath)
}

function loadForumSlugs(src) {
  return [...src.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map((m) => m[1])
}

function loadForumMeta(src) {
  const pattern =
    /slug:\s*['"]([^'"]+)['"],[\s\S]*?metaTitle:\s*['"]([^'"]+)['"],[\s\S]*?metaDescription:\s*['"]([^'"]+)['"]/g
  return [...src.matchAll(pattern)].map((m) => ({
    slug: m[1],
    title: m[2],
    description: m[3],
  }))
}

const heroFull = join(mediaDir, 'dayz-hero-full.webp')
const coverArt = join(mediaDir, 'dayz-cover.webp')
const espOutdoor = join(mediaDir, 'finals-esp-gameplay.webp')
const espTraining = join(mediaDir, 'finals-gameplay-training-range.webp')
const espDoorway = join(mediaDir, 'finals-gameplay-doorway-esp.webp')
const espArena = join(mediaDir, 'finals-gameplay-arena-elimination.webp')
const espLab = join(mediaDir, 'finals-gameplay-laboratory-esp.webp')
const espRedGrid = join(mediaDir, 'finals-gameplay-red-grid-radar.webp')
const espOffice = join(mediaDir, 'finals-gameplay-office-esp.webp')
const espGif = join(mediaDir, 'dayz-esp-gameplay.gif')
const menuGif = join(mediaDir, 'dayz-menu.gif')
const videoThumb = join(mediaDir, 'dayz-video-thumb.jpg')

const staticOg = [
  {
    file: 'home.jpg',
    source: espTraining,
    eyebrow: 'THE FINALS HACK',
    title: 'THE FINALS Aimbot, ESP & Radar Hack',
    subtitle: 'The Finals hack from $35 · live Easy Anti-Cheat status',
  },
  {
    file: 'the-finals-hack.jpg',
    source: espOutdoor,
    eyebrow: 'PRODUCT DETAILS',
    title: 'THE FINALS Aimbot, ESP & Radar',
    subtitle: 'Features, Easy Anti-Cheat status and price',
  },
  {
    file: 'forums.jpg',
    source: espLab,
    eyebrow: 'GUIDES',
    title: 'The Finals Hack Setup Forums',
    subtitle: 'Aimbot, ESP, loader and Easy Anti-Cheat guides',
  },
  {
    file: 'reviews.jpg',
    source: espOffice,
    eyebrow: 'REVIEWS',
    title: 'The Finals Hack Buyer Reviews',
    subtitle: 'Real THE FINALS Aimbot and ESP feedback',
  },
  {
    file: 'faq.jpg',
    source: espDoorway,
    eyebrow: 'FAQ',
    title: 'The Finals Hack FAQ',
    subtitle: 'Price, Easy Anti-Cheat status and setup answers',
  },
  {
    file: 'support.jpg',
    source: espRedGrid,
    eyebrow: 'SUPPORT',
    title: 'The Finals Hack Support',
    subtitle: 'Loader, delivery and Windows help',
  },
  {
    file: 'privacy.jpg',
    source: heroFull,
    eyebrow: 'POLICY',
    title: 'Privacy Policy',
    subtitle: 'How thefinalshack.org handles order data',
  },
  {
    file: 'terms.jpg',
    source: heroFull,
    eyebrow: 'POLICY',
    title: 'Terms of Use',
    subtitle: 'License rules for The Finals Hack',
  },
  {
    file: 'refunds.jpg',
    source: coverArt,
    eyebrow: 'POLICY',
    title: 'Refund Policy',
    subtitle: 'Digital license refund rules',
  },
]

const created = []

for (const item of staticOg) {
  const out = join(ogDir, item.file)
  await writeOgJpeg(out, item.source, item.eyebrow, item.title, item.subtitle)
  created.push(item.file)
}

const blogsSrc = await readFile(blogsPath, 'utf8')
const forums = loadForumMeta(blogsSrc)
if (!forums.length) {
  // Fallback if regex misses — at least create from slugs
  for (const slug of loadForumSlugs(blogsSrc)) {
    forums.push({
      slug,
      title: `The Finals Hack ${slug}`,
      description: 'The Finals hack guide on thefinalshack.org',
    })
  }
}

for (const forum of forums) {
  const file = `forums-${forum.slug}.jpg`
  const out = join(ogDir, file)
  const source =
    /esp|wallhack/i.test(forum.slug)
      ? espDoorway
      : /radar/i.test(forum.slug)
        ? espTraining
        : /raid/i.test(forum.slug)
          ? espRedGrid
          : /aimbot/i.test(forum.slug)
            ? espLab
            : /features|undetected/i.test(forum.slug)
              ? espArena
              : /hotkeys|loader|complete-setup/i.test(forum.slug)
                ? espOffice
                : /windows|antivirus|stream|easy-anti-cheat/i.test(forum.slug)
                  ? espOutdoor
                  : espRedGrid
  await writeOgJpeg(
    out,
    source,
    'THE FINALS HACK',
    forum.title.replace(/\s*\|\s*.*$/, '').slice(0, 48),
    'The Finals hack · thefinalshack.org',
  )
  created.push(file)
}

// Auxiliary on-page art (only if missing)
async function writeIfMissing(path, factory) {
  if (await exists(path)) return false
  await factory(path)
  return true
}

function fillerSvg(width, height, eyebrow, title, subtitle) {
  return Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#08060f"/>
      <text x="${width * 0.075}" y="${height * 0.47}" fill="#c084fc" font-size="${width * 0.022}" font-family="Arial, sans-serif" font-weight="700" letter-spacing="6">${escapeXml(eyebrow)}</text>
      <text x="${width * 0.075}" y="${height * 0.64}" fill="#ffffff" font-size="${width * 0.05}" font-family="Arial, sans-serif" font-weight="700">${escapeXml(title)}</text>
      <text x="${width * 0.075}" y="${height * 0.75}" fill="#c9bdd2" font-size="${width * 0.026}" font-family="Arial, sans-serif">${escapeXml(subtitle)}</text>
    </svg>
  `)
}

for (const [name, eyebrow, title, subtitle] of [
  ['dayz-tactical-art.jpg', 'THE FINALS', 'The Finals Hack', 'Aimbot · ESP · Cashout ESP · Easy Anti-Cheat'],
  ['dayz-control-art.jpg', 'THE FINALS · WINDOWS PC', 'THE FINALS ESP & Radar', 'Built for THE FINALS cashout rounds'],
  ['dayz-home-art.jpg', 'thefinalshack.org', 'The Finals Hack', 'Aimbot, ESP, wallhack and radar hack'],
]) {
  const path = join(mediaDir, name)
  if (
    await writeIfMissing(path, (p) =>
      sharp(fillerSvg(1200, 675, eyebrow, title, subtitle))
        .jpeg({ quality: 90, chromaSubsampling: '4:4:4' })
        .toFile(p),
    )
  ) {
    created.push(name)
  }
}

console.log(`SEO OG images ready (${created.length}): ${created.slice(0, 8).join(', ')}…`)
