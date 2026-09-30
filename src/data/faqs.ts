export type FaqItem = {
  q: string
  a: string
}

/** Master FAQ — visible on /faq and reused in sections. */
export const SITE_FAQS: FaqItem[] = [
  {
    q: 'What is The Finals Hack?',
    a: 'The Finals Hack is a THE FINALS tool on thefinalshack.org — silent-aim Aimbot, player ESP, wallhack, class and cashout ESP, and a 2D radar hack — with live Easy Anti-Cheat status after game patches.',
  },
  {
    q: 'How much does The Finals Hack cost?',
    a: `The Finals Hack starts from $35 for short access. Longer licenses cost more. Always confirm live Easy Anti-Cheat status and the price on thefinalshack.org before checkout.`,
  },
  {
    q: 'Do you sell The Finals hacks for other games?',
    a: 'No. thefinalshack.org sells The Finals hack / The Finals hacks only — one product, no multi-game catalog.',
  },
  {
    q: 'Is Aimbot the main feature?',
    a: 'Aimbot is optional. Most buyers lead with THE FINALS ESP, cashout highlighting and radar awareness, then enable silent aim only if they want it.',
  },
  {
    q: 'How do you handle Easy Anti-Cheat updates?',
    a: 'We publish live clear-to-load or Updating labels after THE FINALS and Easy Anti-Cheat patches. Always check status on thefinalshack.org before you load.',
  },
  {
    q: 'What is THE FINALS ESP / wallhack?',
    a: 'THE FINALS ESP and wallhack show contestants through walls with distance, health and class when supported. Cashout ESP highlights cashouts, vaults and dropped weapons so empty rooms stop wasting your time.',
  },
  {
    q: 'What is the THE FINALS radar hack?',
    a: 'The radar hack is a 2D overlay for off-screen contestants and third parties — useful when rotating to a cashout or holding an arena.',
  },
  {
    q: 'What features are included?',
    a: 'THE FINALS Aimbot with silent aim, player ESP, class ESP, cashout ESP, radar hack, cashout and vault intel, spoofer and stream-proof options — THE FINALS on Windows PC only. See the Features Checklist guide for the full list.',
  },
  {
    q: 'Does The Finals Hack work in casual and ranked?',
    a: 'Yes. It is built for THE FINALS matchmaking on Windows PC, including casual, ranked and World Tour. Ask support before you buy if you play a limited test build.',
  },
  {
    q: 'How do I buy The Finals hack?',
    a: 'Start on the homepage, confirm live Easy Anti-Cheat status and review the price from $35. Open Product details for compatibility and features, then continue to checkout for digital delivery.',
  },
  {
    q: 'How do I load The Finals Hack?',
    a: 'After checkout, follow the Complete Setup forum thread for the current load order. If status is Updating, wait rather than forcing an outdated build.',
  },
  {
    q: 'Where do I get The Finals Hack support?',
    a: 'Use the Support page and your checkout order channel. Include current Easy Anti-Cheat status and whether you need load, menu or delivery help.',
  },
  {
    q: 'Where can I read The Finals Hack reviews?',
    a: 'Player reviews with ratings are on the Reviews page. They cover ESP usefulness, status honesty and patch survival before you buy.',
  },
  {
    q: 'What is your refund policy?',
    a: 'Digital licenses follow the Refunds page — delivery failures and extended Updating windows can qualify; change of mind after a working key does not.',
  },
  {
    q: 'Is this the official THE FINALS site?',
    a: 'No. We sell The Finals Hack only. Buy and play the game from reachthefinals.com. We are not affiliated with Embark Studios or THE FINALS.',
  },
]

/** Commercial questions shown on the homepage; FAQ schema lives on /faq only. */
export const HOME_FAQS: FaqItem[] = [
  SITE_FAQS[1],
  SITE_FAQS[4],
  SITE_FAQS[5],
  SITE_FAQS[9],
]

export const PRODUCT_PAGE_FAQS: FaqItem[] = [
  SITE_FAQS[1],
  SITE_FAQS[4],
  SITE_FAQS[5],
  SITE_FAQS[6],
  SITE_FAQS[9],
  SITE_FAQS[11],
]
