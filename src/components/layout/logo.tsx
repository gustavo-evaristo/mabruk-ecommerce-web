import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface LogoProps {
  size?: number;
  className?: string;
  inverted?: boolean;
}

export function Logo({ size = 28, className, inverted }: LogoProps) {
  return (
    <Link href="/" className={cn('inline-flex items-center', className)} aria-label="Mabruk — Página inicial">
      <Image
        src="/mabruk-logo.png"
        alt="Mabruk Semijoias"
        height={size}
        width={size * 4}
        priority
        className={cn('h-auto w-auto', inverted && 'invert')}
        style={{ height: size }}
      />
    </Link>
  );
}
