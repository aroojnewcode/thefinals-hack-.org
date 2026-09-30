import { DAYZ_OG } from './images'
import { PAGE_OG } from './og'

export const SITE_URL = 'https://thefinalshack.org'
export const SITE_NAME = 'The Finals Hack'
export const SITE_HOST = 'thefinalshack.org'

/**
 * Sole purpose — used in schema + about copy.
 * Single-product site: THE FINALS / THE FINALS cheats for PC (worldwide).
 * Canonical host is apex https://thefinalshack.org (www 301s to apex in the Worker).
 */
export const SITE_PURPOSE =
  'Buy The Finals hack for THE FINALS on Windows PC — silent-aim Aimbot, player and cashout ESP, wallhack, radar hack and live Easy Anti-Cheat status with instant digital delivery.'

export const SITE_ABOUT = [
  'the finals hack',
  'the finals hacks',
  'the finals aimbot',
  'the finals esp',
  'the finals wallhack',
  'the finals radar hack',
  'easy anti-cheat the finals',
  'the finals cashout esp',
] as const

/** Offer price shown on product schema + purchase UI. */
export const PRODUCT_PRICE_USD = '35'

export const SEO_REGIONS = [
  { hreflang: 'en', label: 'English' },
  { hreflang: 'x-default', label: 'Default' },
] as const

export const OG_IMAGE = DAYZ_OG

export type PageSeo = {
  title: string
  description: string
  path: string
  ogType?: 'website' | 'article' | 'product'
  /** Prefer /og/*.jpg (1200x630) for Google SERP thumbnails */
  image?: string
  imageAlt?: string
  robots?: string
}

const INDEX_ROBOTS =
  'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'

export const SEO = {
  home: {
    title: 'The Finals Hack | Aimbot, ESP & Hacks',
    description:
      'Buy The Finals hack for THE FINALS — silent aim Aimbot, player and cashout ESP, wallhack and radar hack from $35. Check live Easy Anti-Cheat status, then checkout.',
    path: '/',
    ogType: 'website',
    image: PAGE_OG.home,
    imageAlt: 'The Finals Hack — THE FINALS Aimbot, ESP and radar hack for PC',
    robots: INDEX_ROBOTS,
  },
  forums: {
    title: 'The Finals Hack Guides | Aimbot, ESP, Radar & Status',
    description:
      'The Finals hack guides hub — silent aim, player and cashout ESP, radar hack, antivirus exclusions, loader setup and Easy Anti-Cheat status articles before you buy.',
    path: '/forums',
    ogType: 'website',
    image: PAGE_OG.forums,
    imageAlt: 'The Finals Hack setup guides for Aimbot, ESP and Easy Anti-Cheat',
    robots: INDEX_ROBOTS,
  },
  reviews: {
    title: 'The Finals Hack Reviews | Buyer Feedback on The Finals Hacks',
    description:
      'Read The Finals hack reviews covering silent aim, player ESP, cashout ESP and Easy Anti-Cheat rebuilds before you buy a THE FINALS license for PC.',
    path: '/reviews',
    ogType: 'website',
    image: PAGE_OG.reviews,
    imageAlt:
      'THE FINALS blue office map with FCAR, skeleton ESP and radar hack overlay on The Finals hack reviews page',
    robots: INDEX_ROBOTS,
  },
  faq: {
    title: 'The Finals Hack FAQ | Price, Easy Anti-Cheat Status & Setup',
    description:
      'FAQ for buying The Finals hack on Windows PC — price, Aimbot and ESP features, Easy Anti-Cheat status, ranked match support, loader setup and delivery.',
    path: '/faq',
    ogType: 'website',
    image: PAGE_OG.faq,
    imageAlt: 'The Finals Hack FAQ — price, Easy Anti-Cheat and setup',
    robots: INDEX_ROBOTS,
  },
  support: {
    title: 'The Finals Hack Support | Loader, Delivery & Setup Help',
    description:
      'Get help buying and loading The Finals hack — delivery email, Windows setup, antivirus exclusions, loader errors and Easy Anti-Cheat status updates.',
    path: '/support',
    ogType: 'website',
    image: PAGE_OG.support,
    imageAlt: 'The Finals Hack support for loader and delivery help',
    robots: INDEX_ROBOTS,
  },
  product: {
    title: 'The Finals Hack Price & Checkout | Aimbot, ESP, Radar',
    description:
      'The Finals hack price and checkout — silent aim Aimbot, player ESP, cashout ESP, wallhack, radar hack, spoofer and live Easy Anti-Cheat status from $35.',
    path: '/the-finals-hack',
    ogType: 'product',
    image: PAGE_OG.product,
    imageAlt:
      'THE FINALS outdoor firefight with purple ESP player box and skeleton wallhack on The Finals hack product page',
    robots: INDEX_ROBOTS,
  },
} as const satisfies Record<string, PageSeo>

export const HOME_HEADINGS = {
  h1: 'The Finals Hack — Aimbot, ESP & Hacks',
  h2Features: 'THE FINALS Aimbot, ESP, cashout ESP & radar hack',
  h2Featured: 'THE FINALS ESP and silent aim Aimbot',
  h2About: 'Clear Easy Anti-Cheat status before you buy The Finals hack',
  h2Access: 'Buy The Finals Hack',
  h2Faq: 'The Finals Hack FAQ',
} as const

export function absoluteUrl(path: string) {
  if (!path || path === '/') return `${SITE_URL}/`
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}
