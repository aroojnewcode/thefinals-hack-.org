export type GameStatus = 'Undetected' | 'Updating' | 'Use with caution'

export type Game = {
  slug: string
  name: string
  status: GameStatus
  popular?: boolean
}

/** Site is The Finals hack only — no other titles in the catalog. */
export const GAMES: Game[] = [
  { slug: 'the-finals', name: 'THE FINALS', status: 'Undetected', popular: true },
]

export function getGame(slug: string) {
  return GAMES.find((g) => g.slug === slug)
}

export function guidePath(slug: string) {
  return `/${slug.toLowerCase()}-hack`
}

export function parseGuideSlug(param: string) {
  const lower = param.toLowerCase()
  return lower.endsWith('-hack') ? lower.slice(0, -5) : lower
}

export const GUIDE_FEATURES = [
  {
    name: 'THE FINALS Aimbot (silent aim)',
    text: 'Silent-aim tracking with FOV, smoothing and bone selection — fire near a contestant and still land the hit, so it reads as legit even when an admin spectates.',
  },
  {
    name: 'Player ESP / Wallhack',
    text: 'See contestants through walls and cover with distance, health and gear information when the build supports it — tell friendlies from hostiles instantly.',
  },
  {
    name: 'Class ESP',
    text: 'Mark Light, Medium and Heavy contestants before they reach the cashout, so a rotate never turns into a surprise third party.',
  },
  {
    name: 'Cashout ESP',
    text: 'Highlight cashouts, vaults and dropped weapons so you rotate to the objective instead of empty rooms.',
  },
  {
    name: 'Radar Hack',
    text: '2D radar awareness for off-screen contestants across ranked arenas — spot the third party before it reaches your position.',
  },
  {
    name: 'Cashout & vault intel',
    text: 'Spot cashouts and vaults in the arena so your team commits to a live objective instead of an empty site.',
  },
  {
    name: 'Casual, ranked and World Tour',
    text: 'Built for THE FINALS matchmaking on Windows PC — casual, ranked and World Tour.',
  },
  {
    name: 'Spoofer + Cleaner',
    text: 'Protect hardware identifiers and refresh traces after bans or hardware swaps — included with the package.',
  },
  {
    name: 'Easy Anti-Cheat status + support',
    text: 'Live clear-to-load or Updating status is reviewed after Easy Anti-Cheat and THE FINALS patches before you load.',
  },
] as const

/** @deprecated use PRODUCT_PAGE_FAQS from faqs.ts — kept as alias */
export { PRODUCT_PAGE_FAQS as PRODUCT_FAQS } from './faqs'
