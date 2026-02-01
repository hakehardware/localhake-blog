import type { ReactNode } from 'react';

interface LayoutProps {
  title?: string;
  description?: string;
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <div data-testid="layout">{children}</div>;
}
