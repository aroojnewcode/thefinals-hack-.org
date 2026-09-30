import { ChevronDown } from 'lucide-react'
import type { FaqItem } from '../data/faqs'

type FaqSectionProps = {
  id?: string
  heading: string
  intro?: string
  items: FaqItem[]
  /** Extra class on the outer section */
  className?: string
  /** Optional link under the list (e.g. full FAQ on homepage) */
  moreHref?: string
  moreLabel?: string
  /** Answer paragraph color (default muted for long FAQ pages). */
  answerClassName?: string
}

/**
 * Visible FAQ accordion: real H2 + answer text in the DOM.
 * Questions use strong text (not H3) so page heading counts stay proportional.
 * Structured data comes from page-level FAQPage JSON-LD only (no duplicate microdata).
 */
export function FaqSection({
  id = 'faq',
  heading,
  intro,
  items,
  className = '',
  moreHref,
  moreLabel = 'All questions →',
  answerClassName = 'text-white/55',
}: FaqSectionProps) {
  return (
    <section
      id={id}
      className={`page-x border-t border-z-soft/15 py-14 sm:py-16 ${className}`.trim()}
      aria-labelledby={`${id}-heading`}
    >
      <div className="mx-auto max-w-3xl">
        <h2
          id={`${id}-heading`}
          className="text-2xl font-semibold tracking-tight text-white sm:text-3xl"
        >
          {heading}
        </h2>
        {intro ? (
          <p className="mt-3 text-sm leading-relaxed text-white/55 sm:text-base">{intro}</p>
        ) : null}

        <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
          {items.map((item) => (
            <details key={item.q} className="group py-1">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-5 text-left outline-none marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="text-sm font-semibold leading-snug text-white sm:text-base">
                  {item.q}
                </span>
                <ChevronDown
                  className="mt-0.5 h-4 w-4 shrink-0 text-white/40 transition-transform duration-200 group-open:rotate-180"
                  strokeWidth={1.75}
                  aria-hidden
                />
              </summary>
              <p className={`pb-5 pr-8 text-sm leading-relaxed ${answerClassName}`}>{item.a}</p>
            </details>
          ))}
        </div>

        {moreHref ? (
          <a
            href={moreHref}
            className="mt-8 inline-flex text-sm font-semibold text-z-soft transition-colors hover:text-white"
          >
            {moreLabel}
          </a>
        ) : null}
      </div>
    </section>
  )
}
