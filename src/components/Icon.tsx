import type { ReactNode } from 'react'

type IconName =
  | 'crown'
  | 'cards'
  | 'chess'
  | 'skull'
  | 'users'
  | 'sound'
  | 'mute'
  | 'share'
  | 'download'
  | 'upload'
  | 'refresh'
  | 'plus'
  | 'trash'
  | 'check'
  | 'close'
  | 'undo'
  | 'copy'
  | 'chevron'
  | 'spark'
  | 'menu'

const PATHS: Record<IconName, ReactNode> = {
  crown: (
    <>
      <path d="M3 8.5 6.5 12 12 5l5.5 7L21 8.5 19.4 18H4.6L3 8.5Z" />
      <path d="M4.6 20.5h14.8" />
    </>
  ),
  cards: (
    <>
      <rect x="3" y="6" width="10" height="14" rx="2" />
      <path d="M8.5 3.5h7a2 2 0 0 1 2 2v10" />
      <path d="M8 11v4M6.4 13h3.2" />
    </>
  ),
  chess: (
    <>
      <path d="M9 3h6l-.8 4.2c1.6 1 2.4 2.4 2.4 4.3H7.4c0-1.9.8-3.3 2.4-4.3L9 3Z" />
      <path d="M7 14.5h10l1 4H6l1-4Z" />
      <path d="M5 21h14" />
    </>
  ),
  skull: (
    <>
      <path d="M12 2.8c-4.2 0-7 2.9-7 6.8 0 2.2 1 3.7 2.3 4.8v3.1c0 .8.6 1.5 1.4 1.5h6.6c.8 0 1.4-.7 1.4-1.5v-3.1C18 13.3 19 11.8 19 9.6c0-3.9-2.8-6.8-7-6.8Z" />
      <circle cx="9.2" cy="9.8" r="1.6" />
      <circle cx="14.8" cy="9.8" r="1.6" />
      <path d="M10.4 19v2.4M13.6 19v2.4" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.4" />
      <path d="M2.8 20c0-3.3 2.8-5.6 6.2-5.6s6.2 2.3 6.2 5.6" />
      <path d="M16.4 5.2a3.2 3.2 0 0 1 0 6.1M18.2 14.8c1.9.7 3 2.2 3 4.2" />
    </>
  ),
  sound: (
    <>
      <path d="M4 9.5h3.2L12 5.5v13L7.2 14.5H4a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1Z" />
      <path d="M16 8.8a4.6 4.6 0 0 1 0 6.4M18.6 6.2a8 8 0 0 1 0 11.6" />
    </>
  ),
  mute: (
    <>
      <path d="M4 9.5h3.2L12 5.5v13L7.2 14.5H4a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1Z" />
      <path d="m16.5 9.5 5 5M21.5 9.5l-5 5" />
    </>
  ),
  share: (
    <>
      <path d="M12 16V3.5M12 3.5 8 7.5M12 3.5l4 4" />
      <path d="M4.5 13v6.5a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1V13" />
    </>
  ),
  download: (
    <>
      <path d="M12 3.5V15M12 15l-4-4M12 15l4-4" />
      <path d="M4.5 17v3.5h15V17" />
    </>
  ),
  upload: (
    <>
      <path d="M12 15V3.5M12 3.5 8 7.5M12 3.5l4 4" />
      <path d="M4.5 17v3.5h15V17" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 12a8 8 0 1 1-2.6-5.9" />
      <path d="M20.5 3.5V9H15" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  trash: (
    <>
      <path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l1 13.5h9L17.5 7" />
      <path d="M10.5 11v6M13.5 11v6" />
    </>
  ),
  check: <path d="m4.5 12.5 5 5 10-11" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  undo: (
    <>
      <path d="M4 9.5h9.5a5.5 5.5 0 0 1 0 11H9" />
      <path d="M4 9.5 8.5 5M4 9.5 8.5 14" />
    </>
  ),
  copy: (
    <>
      <rect x="8.5" y="8.5" width="12" height="12" rx="2" />
      <path d="M15.5 5.5v-1a1 1 0 0 0-1-1h-10a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h1" />
    </>
  ),
  chevron: <path d="m9 6 6 6-6 6" />,
  spark: (
    <>
      <path d="M12 3v5M12 16v5M3 12h5M16 12h5" />
      <path d="m6.5 6.5 3 3M14.5 14.5l3 3M17.5 6.5l-3 3M9.5 14.5l-3 3" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
}

export function Icon({
  name,
  size = 20,
  className,
  filled = false,
}: {
  name: IconName
  size?: number
  className?: string
  filled?: boolean
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  )
}

export function Logo({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="tb-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffd978" />
          <stop offset="55%" stopColor="#f5b93c" />
          <stop offset="100%" stopColor="#e08a1e" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="30" height="30" rx="9" fill="#16161d" stroke="rgba(245,185,60,.35)" />
      <path
        d="M7 11.5 10.4 14.6 16 8.2l5.6 6.4L25 11.5l-1.6 10.4H8.6L7 11.5Z"
        fill="url(#tb-gold)"
      />
      <rect x="9" y="23" width="14" height="2.2" rx="1.1" fill="#f5b93c" opacity=".75" />
    </svg>
  )
}
