export type SupportTopic = {
  heading: string
  body: string[]
}

export type SupportFaq = {
  q: string
  a: string
}

export const SUPPORT_INTRO =
  'Support for The Finals Hack buyers on thefinalshack.org — loader setup, Easy Anti-Cheat status, menu config and delivery help after you purchase The Finals hack.'

export const SUPPORT_TOPICS: SupportTopic[] = [
  {
    heading: 'Status before you load',
    body: [
      'Check live status on the product page. If it says Updating, do not load. Wait until it is clear to load again.',
      'Easy Anti-Cheat patches can invalidate yesterday’s build. Status honesty matters more than rushing a session.',
    ],
  },
  {
    heading: 'Loader and menu issues',
    body: [
      'Follow Complete Setup for antivirus exclusions and load order before you open a ticket.',
      'If the product is Updating, wait. If a clear-to-load build still fails after one clean retry, open a support request with your order ID.',
    ],
  },
  {
    heading: 'Delivery and refunds',
    body: [
      'Delivery failures and extended Updating windows are covered on the Refunds page. Include your order ID when you write in.',
    ],
  },
  {
    heading: 'What we can and cannot help with',
    body: [
      'Supported: THE FINALS on Windows, official and common ranked matches, loader and menu help for paid licenses.',
      'Not supported: other games, cracked loaders or third-party mirrors.',
    ],
  },
]

export const SUPPORT_FAQS: SupportFaq[] = [
  {
    q: 'How do I contact The Finals Hack support?',
    a: 'Open your order on thefinalshack.org and use the checkout support channel tied to your purchase. Include a status screenshot (clear to load / Updating) and whether you need load, menu or delivery help.',
  },
  {
    q: 'The loader will not open — what first?',
    a: 'Follow the Complete Setup forum thread for the current load order. If status is Updating, wait; if a clear-to-load build fails, include your order ID in a support request.',
  },
  {
    q: 'Menu opened once then never again?',
    a: 'Do not spam launch. Restart THE FINALS, confirm antivirus exclusions, re-check status, then try one clean load. If it still fails, contact support with your order ID.',
  },
  {
    q: 'Do you support private THE FINALS servers?',
    a: 'Most common modded ranked matches work. Heavily scripted communities can differ — ask support with the server name before you buy if that is your only play environment.',
  },
  {
    q: 'Where is my delivery?',
    a: 'Delivery is digital after checkout on thefinalshack.org. Use only that loader link. Third-party mirrors are unsupported and unsafe.',
  },
]
