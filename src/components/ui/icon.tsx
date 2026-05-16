import type { SVGProps } from 'react';

/**
 * Biblioteca SVG inline da Mabruk. Stroke = 1.25px, traços limpos.
 * Origem: design_handoff_mabruk_b2c/design-files/components.jsx
 */
export type IconName =
  | 'search'
  | 'user'
  | 'bag'
  | 'heart'
  | 'heartFill'
  | 'menu'
  | 'close'
  | 'arrowRight'
  | 'arrowLeft'
  | 'chevronDown'
  | 'chevronRight'
  | 'plus'
  | 'minus'
  | 'check'
  | 'star'
  | 'starFill'
  | 'truck'
  | 'creditCard'
  | 'pix'
  | 'lock'
  | 'map'
  | 'pkg'
  | 'chart'
  | 'dollar'
  | 'box'
  | 'edit'
  | 'trash'
  | 'eye'
  | 'filter'
  | 'grid'
  | 'list'
  | 'instagram'
  | 'home'
  | 'settings'
  | 'tag'
  | 'users'
  | 'bell'
  | 'upload'
  | 'zoom'
  | 'play';

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name' | 'stroke'> {
  name: IconName;
  size?: number;
  stroke?: number;
}

export function Icon({ name, size = 18, stroke = 1.25, ...rest }: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: stroke,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
    ...rest,
  };
  const filled = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'currentColor',
    'aria-hidden': true as const,
    ...rest,
  };

  switch (name) {
    case 'search':
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      );
    case 'user':
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
        </svg>
      );
    case 'bag':
      return (
        <svg {...common}>
          <path d="M5 8h14l-1 12H6L5 8Z" />
          <path d="M9 8a3 3 0 1 1 6 0" />
        </svg>
      );
    case 'heart':
      return (
        <svg {...common}>
          <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z" />
        </svg>
      );
    case 'heartFill':
      return (
        <svg {...filled}>
          <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z" />
        </svg>
      );
    case 'menu':
      return (
        <svg {...common}>
          <path d="M3 7h18M3 12h18M3 17h18" />
        </svg>
      );
    case 'close':
      return (
        <svg {...common}>
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      );
    case 'arrowRight':
      return (
        <svg {...common}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      );
    case 'arrowLeft':
      return (
        <svg {...common}>
          <path d="M19 12H5M11 6l-6 6 6 6" />
        </svg>
      );
    case 'chevronDown':
      return (
        <svg {...common}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      );
    case 'chevronRight':
      return (
        <svg {...common}>
          <path d="m9 6 6 6-6 6" />
        </svg>
      );
    case 'plus':
      return (
        <svg {...common}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case 'minus':
      return (
        <svg {...common}>
          <path d="M5 12h14" />
        </svg>
      );
    case 'check':
      return (
        <svg {...common}>
          <path d="m5 12 5 5L20 7" />
        </svg>
      );
    case 'star':
      return (
        <svg {...common}>
          <path d="m12 3 2.6 6 6.4.5-4.9 4.3 1.5 6.3L12 17l-5.6 3.1L7.9 13.8 3 9.5 9.4 9 12 3Z" />
        </svg>
      );
    case 'starFill':
      return (
        <svg {...filled}>
          <path d="m12 2.5 2.7 6.4 6.9.6-5.2 4.6 1.6 6.7L12 17.3l-6 3.5 1.6-6.7-5.2-4.6 6.9-.6L12 2.5Z" />
        </svg>
      );
    case 'truck':
      return (
        <svg {...common}>
          <path d="M3 7h11v10H3zM14 10h4l3 3v4h-7" />
          <circle cx="7" cy="18" r="2" />
          <circle cx="17" cy="18" r="2" />
        </svg>
      );
    case 'creditCard':
      return (
        <svg {...common}>
          <rect x="3" y="6" width="18" height="13" rx="1" />
          <path d="M3 10h18" />
        </svg>
      );
    case 'pix':
      return (
        <svg {...common}>
          <path d="m4 12 8-8 8 8-8 8-8-8Z" />
          <path d="m8 12 4 4 4-4-4-4-4 4Z" />
        </svg>
      );
    case 'lock':
      return (
        <svg {...common}>
          <rect x="5" y="11" width="14" height="10" rx="1" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
      );
    case 'map':
      return (
        <svg {...common}>
          <path d="M12 21s-7-7-7-12a7 7 0 0 1 14 0c0 5-7 12-7 12Z" />
          <circle cx="12" cy="9" r="2.5" />
        </svg>
      );
    case 'pkg':
      return (
        <svg {...common}>
          <path d="M3 7v10l9 4 9-4V7l-9-4-9 4Z" />
          <path d="M3 7l9 4 9-4M12 11v10" />
        </svg>
      );
    case 'chart':
      return (
        <svg {...common}>
          <path d="M4 20h16M7 16V9M12 16V5M17 16v-7" />
        </svg>
      );
    case 'dollar':
      return (
        <svg {...common}>
          <path d="M12 3v18M16 7c0-2-2-3-4-3s-4 1-4 3 2 3 4 3 4 1 4 3-2 3-4 3-4-1-4-3" />
        </svg>
      );
    case 'box':
      return (
        <svg {...common}>
          <path d="M4 7h16v13H4zM4 7l2-3h12l2 3" />
        </svg>
      );
    case 'edit':
      return (
        <svg {...common}>
          <path d="M16 4l4 4-12 12H4v-4L16 4Z" />
        </svg>
      );
    case 'trash':
      return (
        <svg {...common}>
          <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13h10l1-13" />
        </svg>
      );
    case 'eye':
      return (
        <svg {...common}>
          <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case 'filter':
      return (
        <svg {...common}>
          <path d="M4 6h16M7 12h10M10 18h4" />
        </svg>
      );
    case 'grid':
      return (
        <svg {...common}>
          <rect x="4" y="4" width="7" height="7" />
          <rect x="13" y="4" width="7" height="7" />
          <rect x="4" y="13" width="7" height="7" />
          <rect x="13" y="13" width="7" height="7" />
        </svg>
      );
    case 'list':
      return (
        <svg {...common}>
          <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
        </svg>
      );
    case 'instagram':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="4" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r=".5" fill="currentColor" />
        </svg>
      );
    case 'home':
      return (
        <svg {...common}>
          <path d="M4 11l8-7 8 7v9h-5v-6h-6v6H4v-9Z" />
        </svg>
      );
    case 'settings':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19 12a7 7 0 0 0-.1-1.3l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2.2-1.3L14 3h-4l-.4 2.4a7 7 0 0 0-2.2 1.3l-2.3-.9-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .9.1 1.3l-2 1.5 2 3.4 2.3-.9a7 7 0 0 0 2.2 1.3L10 21h4l.4-2.4a7 7 0 0 0 2.2-1.3l2.3.9 2-3.4-2-1.5c0-.4.1-.9.1-1.3Z" />
        </svg>
      );
    case 'tag':
      return (
        <svg {...common}>
          <path d="M3 12V3h9l9 9-9 9-9-9Z" />
          <circle cx="7.5" cy="7.5" r="1" />
        </svg>
      );
    case 'users':
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3.5" />
          <path d="M2 20c0-3 3-5 7-5s7 2 7 5" />
          <circle cx="17" cy="6" r="2.5" />
          <path d="M17 12c2.5 0 5 1.5 5 4" />
        </svg>
      );
    case 'bell':
      return (
        <svg {...common}>
          <path d="M6 16V10a6 6 0 0 1 12 0v6l2 2H4l2-2ZM10 20a2 2 0 0 0 4 0" />
        </svg>
      );
    case 'upload':
      return (
        <svg {...common}>
          <path d="M12 16V4M7 9l5-5 5 5M4 20h16" />
        </svg>
      );
    case 'zoom':
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5M8 11h6M11 8v6" />
        </svg>
      );
    case 'play':
      return (
        <svg {...common}>
          <path d="m8 5 11 7-11 7V5Z" />
        </svg>
      );
    default:
      return null;
  }
}
