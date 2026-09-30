import {
  DAYZ_COVER,
  FINALS_ESP_OUTDOOR,
  FINALS_GAMEPLAY_ARENA,
  FINALS_GAMEPLAY_DOORWAY,
  FINALS_PRODUCT_BUY_COVER,
  FINALS_GAMEPLAY_LAB,
  FINALS_GAMEPLAY_OFFICE,
  FINALS_GAMEPLAY_RED_GRID,
  FINALS_GAMEPLAY_TRAINING,
} from './media'
import { DAYZ_OG, getOgImageForPath, PAGE_OG } from './og'

export { DAYZ_OG, getOgImageForPath, PAGE_OG }
export { forumOgImage } from './og'

export const DAYZ_PRODUCT_HERO = FINALS_PRODUCT_BUY_COVER.src
export const DAYZ_PRODUCT_COVER = DAYZ_COVER

export type ImageSeoFields = {
  alt: string
  title: string
  caption: string
}

export const IMAGE_SEO: Record<
  string,
  ImageSeoFields & {
    heroAlt: string
    heroTitle: string
    heroCaption: string
  }
> = {
  'the-finals': {
    alt: FINALS_PRODUCT_BUY_COVER.alt,
    title: 'The Finals Hack Product Details',
    caption: 'THE FINALS Aimbot, ESP, wallhack, cashout ESP, radar hack and Easy Anti-Cheat compatibility',
    heroAlt: FINALS_PRODUCT_BUY_COVER.alt,
    heroTitle: 'Buy The Finals Hack',
    heroCaption: 'Review THE FINALS Aimbot, ESP, radar hack and current Easy Anti-Cheat status',
  },
}

type PageImage = ImageSeoFields & { src: string; og: string }

/** On-page media + dedicated OG JPEG for Google SERP thumbnails. */
export const PAGE_IMAGES: Record<
  'home' | 'forums' | 'reviews' | 'faq' | 'support' | 'product',
  PageImage
> = {
  home: {
    src: FINALS_GAMEPLAY_TRAINING.src,
    og: PAGE_OG.home,
    alt: FINALS_GAMEPLAY_TRAINING.alt,
    title: 'The Finals Hack',
    caption: 'THE FINALS Aimbot, ESP, wallhack and radar hack overview.',
  },
  forums: {
    src: FINALS_GAMEPLAY_LAB.src,
    og: PAGE_OG.forums,
    alt: FINALS_GAMEPLAY_LAB.alt,
    title: 'The Finals Hack Guides',
    caption: 'Setup, Aimbot and ESP guides for THE FINALS.',
  },
  reviews: {
    src: FINALS_GAMEPLAY_OFFICE.src,
    og: PAGE_OG.reviews,
    alt: FINALS_GAMEPLAY_OFFICE.alt,
    title: 'The Finals Hack Reviews',
    caption: 'Feature and compatibility feedback for THE FINALS.',
  },
  faq: {
    src: FINALS_GAMEPLAY_DOORWAY.src,
    og: PAGE_OG.faq,
    alt: FINALS_GAMEPLAY_DOORWAY.alt,
    title: 'The Finals Hack FAQ',
    caption: 'Compatibility, feature and setup answers for THE FINALS.',
  },
  support: {
    src: FINALS_GAMEPLAY_RED_GRID.src,
    og: PAGE_OG.support,
    alt: FINALS_GAMEPLAY_RED_GRID.alt,
    title: 'The Finals Hack Support',
    caption: 'Delivery, loader and setup support for The Finals hack.',
  },
  product: {
    src: FINALS_ESP_OUTDOOR.src,
    og: PAGE_OG.product,
    alt: FINALS_ESP_OUTDOOR.alt,
    title: 'The Finals Hack Features',
    caption: 'Product details for THE FINALS Aimbot and ESP.',
  },
}

export function getGameImage(_slug: string): string {
  return FINALS_ESP_OUTDOOR.src
}

export function getProductHeroImage(_slug: string): string {
  return DAYZ_PRODUCT_HERO
}

export function getOgImage(path?: string): string {
  return getOgImageForPath(path)
}

export function getPageImage(key: keyof typeof PAGE_IMAGES) {
  return PAGE_IMAGES[key]
}

export function getImageAlt(
  slug: string,
  name: string,
  variant: 'catalog' | 'product' = 'catalog',
): string {
  const seo = IMAGE_SEO[slug]
  if (seo) return variant === 'product' ? seo.heroAlt : seo.alt
  return variant === 'product' ? `${name} product details` : `${name} product artwork`
}

export function getImageTitle(
  slug: string,
  name: string,
  variant: 'catalog' | 'product' = 'catalog',
): string {
  const seo = IMAGE_SEO[slug]
  if (seo) return variant === 'product' ? seo.heroTitle : seo.title
  return `${name} product`
}
