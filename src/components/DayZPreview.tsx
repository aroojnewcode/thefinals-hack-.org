import { DAYZ_HOME_VIDEO } from '../data/media'

type DayZPreviewProps = {
  className?: string
  /** Wider crop on product page */
  wide?: boolean
}

/** Self-hosted THE FINALS preview scraped from battlelog (mediadelivery embeds 403 off-domain). */
export function DayZPreview({ className = '', wide = false }: DayZPreviewProps) {
  return (
    <div className={`video-brand-mask border border-z-soft/20 ${className}`.trim()}>
      <div
        className={`relative w-full overflow-hidden ${wide ? 'aspect-video lg:aspect-[21/9]' : 'aspect-video'}`}
      >
        <video
          className="video-brand-crop absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={DAYZ_HOME_VIDEO.poster}
          aria-label={DAYZ_HOME_VIDEO.title}
        >
          <source src={DAYZ_HOME_VIDEO.src} type="video/mp4" />
        </video>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-z-bg/50 via-transparent to-z-bg/20" />
        <div className="video-brand-blur video-brand-blur--top" aria-hidden />
        <div className="video-brand-blur" aria-hidden />
      </div>
      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/60 sm:text-base">
        {DAYZ_HOME_VIDEO.title}. See THE FINALS ESP and wallhack overlays in real matches, how the
        radar hack tracks off-screen contestants, and why we publish live Easy Anti-Cheat status
        after every patch.
      </p>
    </div>
  )
}
