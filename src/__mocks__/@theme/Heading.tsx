import type { ReactNode, ElementType } from 'react';

interface HeadingProps {
  as: ElementType;
  className?: string;
  children: ReactNode;
}

export default function Heading({ as: Component, className, children }: HeadingProps) {
  return <Component className={className}>{children}</Component>;
}
