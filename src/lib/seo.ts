import type { FaqItem } from '../data/faqs'
import {
  getOgImageForPath,
  OG_JPEG_HEIGHT,
  OG_JPEG_WIDTH,
  OG_HOME,
  OG_PRODUCT,
} from '../data/og'
import {
  OG_IMAGE,
  PRODUCT_PRICE_USD,
  SEO_REGIONS,
  SITE_ABOUT,
  SITE_NAME,
  SITE_PURPOSE,
  SITE_URL,
  absoluteUrl,
  type PageSeo,
} from '../data/site'
import { getReviewsAggregate, REVIEWS } from '../data/reviews'
import type { GameStatus } from '../data/games'
export const PRODUCT_ID = `${SITE_URL}/#product`

function absoluteAsset(src: string) {
  return src.startsWith('http') ? src : `${SITE_URL}${src.startsWith('/') ? src : `/${src}`}`
}

function baseOffer(url: string, availability: string) {
  return {
    '@type': 'Offer',
    url,
    availability,
    price: PRODUCT_PRICE_USD,
    priceCurrency: 'USD',
    priceValidUntil: '2027-12-31',
    itemCondition: 'https://schema.org/NewCondition',
    seller: { '@id': `${SITE_URL}/#organization` },
  }
}

/** Stable Organization + WebSite identity for every page. */
export function siteIdentityGraph() {
  return [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      alternateName: [
        'The Finals Hacks',
        'THE FINALS Cheats',
        'thefinalshack.org',
        'THE FINALS Aimbot ESP',
      ],
      url: SITE_URL,
      description: SITE_PURPOSE,
      knowsAbout: [...SITE_ABOUT],
      brand: { '@type': 'Brand', name: SITE_NAME },
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/favicon.svg`,
        width: 48,
        height: 46,
      },
      image: absoluteAsset(OG_IMAGE),
      areaServed: 'Worldwide',
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_PURPOSE,
      inLanguage: 'en',
      about: {
        '@type': 'Thing',
        name: 'The Finals hack',
        description:
          'Commercial The Finals hack for PC — silent aim Aimbot, player ESP, cashout ESP, wallhack, radar hack and Easy Anti-Cheat status.',
      },
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
  ]
}

function schemaOgImage(seo: PageSeo) {
  const path = seo.path || '/'
  return absoluteAsset(getOgImageForPath(path === '' ? '/' : path))
}

export function webPageNode(seo: PageSeo) {
  const page = {
    '@type': 'WebPage',
    '@id': `${absoluteUrl(seo.path)}#webpage`,
    url: absoluteUrl(seo.path),
    name: seo.title,
    description: seo.description,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'en',
  } as Record<string, unknown>
  const hasVisibleImage =
    ['/', '/the-finals-hack', '/forums'].includes(seo.path) || seo.path.startsWith('/forums/')
  // Text pages (faq/support/reviews) still expose OG as WebPage.image for social crawlers
  const hasOgImage = Boolean(seo.image)
  if (hasVisibleImage || hasOgImage) {
    const schemaImg = schemaOgImage(seo)
    page.primaryImageOfPage = {
      '@type': 'ImageObject',
      url: schemaImg,
      width: OG_JPEG_WIDTH,
      height: OG_JPEG_HEIGHT,
      caption: seo.imageAlt || seo.title,
    }
    page.image = schemaImg
  }
  return page
}

export function productCoreJsonLd() {
  return {
    '@type': 'Product',
    '@id': PRODUCT_ID,
    name: 'The Finals Hack',
    alternateName: [
      'The Finals Hacks',
      'THE FINALS Cheats',
      'THE FINALS Aimbot',
      'THE FINALS ESP',
      'THE FINALS Wallhack',
      'THE FINALS Radar Hack',
    ],
    description: SITE_PURPOSE,
    url: `${SITE_URL}/the-finals-hack`,
    image: [absoluteAsset(OG_PRODUCT), absoluteAsset(OG_HOME)],
    brand: { '@type': 'Brand', name: SITE_NAME },
    manufacturer: { '@id': `${SITE_URL}/#organization` },
    category: 'PC game software',
    offers: baseOffer(`${SITE_URL}/the-finals-hack`, 'https://schema.org/InStock'),
    subjectOf: {
      '@type': 'VideoObject',
      name: 'The Finals Hack Aimbot and ESP preview',
      description:
        'Preview of THE FINALS Aimbot, ESP menu, cashout highlighting and radar hack features on PC.',
      thumbnailUrl: absoluteAsset('/media/dayz-video-thumb.jpg'),
      contentUrl: absoluteAsset('/videos/dayz-preview.mp4'),
      uploadDate: '2026-09-16',
      inLanguage: 'en',
    },
  }
}

export function productDetailJsonLd(status: GameStatus) {
  const availability =
    status === 'Undetected' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
  return {
    ...productCoreJsonLd(),
    url: `${SITE_URL}/the-finals-hack`,
    image: absoluteAsset(OG_PRODUCT),
    about: {
      '@type': 'VideoGame',
      name: 'THE FINALS',
      alternateName: ['THE FINALS', 'The Finals'],
      publisher: { '@type': 'Organization', name: 'Embark Studios' },
      gamePlatform: 'PC',
    },
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Platform', value: 'Windows PC' },
      {
        '@type': 'PropertyValue',
        name: 'Features',
        value: 'Silent aim Aimbot, player ESP, class ESP, cashout ESP, wallhack, radar hack, spoofer',
      },
      { '@type': 'PropertyValue', name: 'Anti-cheat', value: 'Easy Anti-Cheat' },
      {
        '@type': 'PropertyValue',
        name: 'Servers',
        value: 'Casual, ranked and World Tour on Windows PC',
      },
      { '@type': 'PropertyValue', name: 'Status', value: status },
    ],
    offers: baseOffer(`${SITE_URL}/the-finals-hack`, availability),
  }
}

export function productReviewsJsonLd() {
  const aggregate = getReviewsAggregate()
  return {
    ...productCoreJsonLd(),
    url: `${SITE_URL}/the-finals-hack`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: aggregate.ratingValue,
      reviewCount: aggregate.reviewCount,
      bestRating: aggregate.bestRating,
      worstRating: aggregate.worstRating,
    },
    review: REVIEWS.map((review) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: review.author },
      datePublished: review.datePublished,
      reviewBody: review.body,
      name: `${review.author} The Finals Hack review`,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: String(review.rating),
        bestRating: '5',
        worstRating: '1',
      },
      itemReviewed: { '@id': PRODUCT_ID },
    })),
  }
}

/** Merge site identity + WebPage + optional extra nodes into FAQ/Product graph. */
export function buildPageJsonLd(seo: PageSeo, extra: unknown[] = []) {
  const cleaned = extra.filter((node) => {
    if (!node || typeof node !== 'object') return true
    const t = (node as { '@type'?: string })['@type']
    return t !== 'WebSite' && t !== 'Organization'
  })
  return {
    '@context': 'https://schema.org',
    '@graph': [...siteIdentityGraph(), webPageNode(seo), ...cleaned],
  }
}

/** Build FAQPage JSON-LD graph node from the same items shown in FaqSection. */
export function faqPageJsonLd(items: FaqItem[], pageUrl?: string) {
  return {
    '@type': 'FAQPage',
    ...(pageUrl ? { '@id': `${pageUrl}#faq`, url: pageUrl } : {}),
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  }
}

export { SEO_REGIONS, absoluteUrl, OG_IMAGE, SITE_NAME, SITE_URL }
