export type SeoMediaItem = {
  image: string
  video?: string
  alt: string
  title: string
  caption: string
  videoTitle?: string
  videoDescription?: string
}

/** Self-hosted THE FINALS cheat gameplay captures (each file used once on-site where possible). */
export const FINALS_ESP_OUTDOOR = {
  src: '/media/finals-esp-gameplay.webp',
  alt:
    'THE FINALS outdoor firefight with ESP wallhack purple player box and blue skeleton overlay on an enemy.',
} as const

export const FINALS_GAMEPLAY_TRAINING = {
  src: '/media/finals-gameplay-training-range.webp',
  alt:
    'THE FINALS practice range showing ESP green boxes, distance labels and circular radar hack on target dummies.',
} as const

export const FINALS_GAMEPLAY_DOORWAY = {
  src: '/media/finals-gameplay-doorway-esp.webp',
  alt:
    'THE FINALS indoor doorway view with green skeleton ESP, player name tags and 2D radar overlay at 5.9 meters.',
} as const

/** Product page “Buy The Finals Hack” purchase card artwork. */
export const FINALS_PRODUCT_BUY_COVER = {
  src: '/media/finals-product-buy-cover.webp',
  alt:
    'Buy The Finals Hack — THE FINALS FCAR view with green skeleton ESP, circular radar hack and contestant tags through a doorway.',
} as const

export const FINALS_GAMEPLAY_ARENA = {
  src: '/media/finals-gameplay-arena-elimination.webp',
  alt:
    'THE FINALS arena combat with FCAR showing green ESP boxes, health bars and contestant distance markers through cover.',
} as const

export const FINALS_GAMEPLAY_LAB = {
  src: '/media/finals-gameplay-laboratory-esp.webp',
  alt:
    'THE FINALS Laboratory 102 interior with red and green skeleton ESP highlighting enemies through walls and floors.',
} as const

export const FINALS_GAMEPLAY_RED_GRID = {
  src: '/media/finals-gameplay-red-grid-radar.webp',
  alt:
    'THE FINALS basement map with red floor grid, distant ESP name tags and blue circular radar hack rings at 20–60m.',
} as const

export const FINALS_GAMEPLAY_OFFICE = {
  src: '/media/finals-gameplay-office-esp.webp',
  alt:
    'THE FINALS blue office map with FCAR, skeleton ESP boxes, player distances and bottom radar hack overlay.',
} as const

/** @deprecated use FINALS_* constants — kept for SEO scripts and legacy paths */
export const FINALS_ESP_GAMEPLAY = FINALS_ESP_OUTDOOR.src
export const FINALS_ESP_GAMEPLAY_ALT = FINALS_ESP_OUTDOOR.alt

export const DAYZ_HERO = '/media/dayz-hero-full.webp'
export const DAYZ_SOLDIER = FINALS_GAMEPLAY_TRAINING.src
export const DAYZ_COVER = FINALS_GAMEPLAY_ARENA.src
export const DAYZ_BOX = FINALS_GAMEPLAY_RED_GRID.src
export const DAYZ_ESP = FINALS_GAMEPLAY_OFFICE.src
export const DAYZ_MENU = '/media/dayz-menu.gif'
export const DAYZ_GAMEPLAY = FINALS_ESP_OUTDOOR.src
export const DAYZ_HOME_ART = '/media/dayz-home-art.jpg'
export const DAYZ_CONTROL = '/media/dayz-control-art.jpg'
export const DAYZ_TACTICAL = '/media/dayz-tactical-art.jpg'
export const DAYZ_VIDEO_THUMB = '/media/dayz-video-thumb.jpg'

/** Self-hosted THE FINALS preview (local MP4). */
export const DAYZ_HOME_VIDEO = {
  id: 'ee0735e7-c9a3-4072-b818-98e2bb7f07ff',
  src: '/videos/dayz-preview.mp4?v=finals',
  poster: DAYZ_VIDEO_THUMB,
  posterAlt: FINALS_GAMEPLAY_DOORWAY.alt,
  title: 'The Finals Hack Aimbot and ESP preview',
  caption: 'Preview of THE FINALS Aimbot, ESP menu, cashout highlighting and radar hack features on PC.',
} as const

export const PAGE_MEDIA = {
  home: {
    image: FINALS_GAMEPLAY_TRAINING.src,
    alt: FINALS_GAMEPLAY_TRAINING.alt,
    title: 'The Finals Hack for THE FINALS',
    caption: 'Feature overview for THE FINALS Aimbot, ESP, wallhack, cashout ESP and radar hack.',
  },
  product: {
    image: FINALS_ESP_OUTDOOR.src,
    video: DAYZ_HOME_VIDEO.src,
    alt: FINALS_ESP_OUTDOOR.alt,
    title: 'THE FINALS Aimbot, ESP and Radar Hack Features',
    caption: 'Product overview for THE FINALS on Windows PC.',
    videoTitle: DAYZ_HOME_VIDEO.title,
    videoDescription: DAYZ_HOME_VIDEO.caption,
  },
  forums: {
    image: FINALS_GAMEPLAY_LAB.src,
    alt: FINALS_GAMEPLAY_LAB.alt,
    title: 'The Finals Hack Guides',
    caption: 'Reference for setup, Aimbot, ESP, loot and Easy Anti-Cheat status articles.',
  },
  reviews: {
    image: FINALS_GAMEPLAY_OFFICE.src,
    alt: FINALS_GAMEPLAY_OFFICE.alt,
    title: 'The Finals Hack Reviews',
    caption: 'Feature and compatibility feedback for The Finals hack.',
  },
  faq: {
    image: FINALS_GAMEPLAY_DOORWAY.src,
    alt: FINALS_GAMEPLAY_DOORWAY.alt,
    title: 'The Finals Hack FAQ',
    caption: 'Compatibility, status and setup answers for THE FINALS.',
  },
  support: {
    image: FINALS_GAMEPLAY_RED_GRID.src,
    alt: FINALS_GAMEPLAY_RED_GRID.alt,
    title: 'The Finals Hack Support',
    caption: 'Delivery, loader and setup help for The Finals hack.',
  },
} as const satisfies Record<string, SeoMediaItem>

const FORUM_MEDIA: Record<string, SeoMediaItem> = {
  'features-list': {
    image: FINALS_GAMEPLAY_ARENA.src,
    alt: FINALS_GAMEPLAY_ARENA.alt,
    title: 'THE FINALS Aimbot, ESP and Radar Hack Features',
    caption: 'Feature checklist before checkout on thefinalshack.org.',
  },
  'aimbot-settings': {
    image: FINALS_GAMEPLAY_LAB.src,
    alt: FINALS_GAMEPLAY_LAB.alt,
    title: 'THE FINALS Aimbot Settings',
    caption: 'Silent aim FOV, smoothing and bone selection for THE FINALS.',
  },
  'esp-wallhack-guide': {
    image: FINALS_GAMEPLAY_DOORWAY.src,
    alt: FINALS_GAMEPLAY_DOORWAY.alt,
    title: 'THE FINALS ESP and Wallhack',
    caption: 'Contestant boxes, class ESP and cashout highlighting setup.',
  },
  'radar-hack-guide': {
    image: FINALS_GAMEPLAY_TRAINING.src,
    alt: FINALS_GAMEPLAY_TRAINING.alt,
    title: 'THE FINALS Radar Hack',
    caption: '2D radar overlay for off-screen contestants and third parties.',
  },
  hotkeys: {
    image: FINALS_GAMEPLAY_RED_GRID.src,
    alt: FINALS_GAMEPLAY_RED_GRID.alt,
    title: 'The Finals Hack Hotkeys',
    caption: 'Menu, Aimbot, ESP and panic binds after load.',
  },
  'complete-setup': {
    image: FINALS_GAMEPLAY_OFFICE.src,
    alt: FINALS_GAMEPLAY_OFFICE.alt,
    title: 'Complete The Finals Hack Setup',
    caption: 'Buy, exclusions, load order and Easy Anti-Cheat checks.',
  },
  'windows-setup': {
    image: FINALS_ESP_OUTDOOR.src,
    alt: FINALS_ESP_OUTDOOR.alt,
    title: 'The Finals Hack on Windows',
    caption: 'Defender exclusions, overlays and admin rights on PC.',
  },
  'disable-antivirus': {
    image: FINALS_GAMEPLAY_TRAINING.src,
    alt: FINALS_GAMEPLAY_TRAINING.alt,
    title: 'Antivirus Exclusions for The Finals Hack',
    caption: 'Allowlist the loader in Windows Defender and AV suites.',
  },
  'stream-proof-setup': {
    image: FINALS_GAMEPLAY_DOORWAY.src,
    alt: FINALS_GAMEPLAY_DOORWAY.alt,
    title: 'Stream-Proof The Finals Hack',
    caption: 'Hide ESP and Aimbot overlays from OBS capture.',
  },
  'easy-anti-cheat-status': {
    image: FINALS_ESP_OUTDOOR.src,
    alt: FINALS_ESP_OUTDOOR.alt,
    title: 'THE FINALS Easy Anti-Cheat Status',
    caption: 'Clear-to-load vs updating after patches.',
  },
  'undetected-status': {
    image: FINALS_GAMEPLAY_ARENA.src,
    alt: FINALS_GAMEPLAY_ARENA.alt,
    title: 'Undetected Status for The Finals Hack',
    caption: 'What undetected means before you load.',
  },
  'raid-play-guide': {
    image: FINALS_GAMEPLAY_RED_GRID.src,
    alt: FINALS_GAMEPLAY_RED_GRID.alt,
    title: 'THE FINALS Cashout Round Cheats Guide',
    caption: 'ESP-first habits for survival and cashout rounds.',
  },
  'loader-errors': {
    image: FINALS_GAMEPLAY_OFFICE.src,
    alt: FINALS_GAMEPLAY_OFFICE.alt,
    title: 'Fix The Finals Hack Loader Errors',
    caption: 'Menu not opening, quarantine and failed inject fixes.',
  },
}

export function getForumMedia(slug: string): SeoMediaItem {
  return FORUM_MEDIA[slug] || PAGE_MEDIA.forums
}

/** Three feature cards below the homepage preview video (before forums). */
export const HOME_FEATURE_SHOTS = [
  {
    image: FINALS_GAMEPLAY_LAB.src,
    alt: FINALS_GAMEPLAY_LAB.alt,
    title: 'Contestant ESP through cover',
    description:
      'See skeleton overlays, names and distance through walls and floors — spot third parties before they swing your cashout.',
  },
  {
    image: FINALS_GAMEPLAY_DOORWAY.src,
    alt: FINALS_GAMEPLAY_DOORWAY.alt,
    title: 'ESP with silent aim overlay',
    description:
      'Player boxes, teammate tags and a tight crosshair view for close-range fights in arenas and interiors.',
  },
  {
    image: FINALS_GAMEPLAY_ARENA.src,
    alt: FINALS_GAMEPLAY_ARENA.alt,
    title: 'Long-range contestant highlight',
    description:
      'Distance markers and health bars on contestants at range so you track pushes across open map lanes.',
  },
] as const
