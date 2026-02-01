import type { ReactNode } from 'react';

interface LinkProps {
  to?: string;
  href?: string;
  className?: string;
  children: ReactNode;
  target?: string;
  rel?: string;
}

export default function Link({ to, href, className, children, ...props }: LinkProps) {
  return (
    <a href={to || href} className={className} {...props}>
      {children}
    </a>
  );
}
