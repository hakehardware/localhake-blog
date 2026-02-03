import type { ReactNode } from 'react';

interface HeadProps {
  children?: ReactNode;
}

/**
 * Mock for @docusaurus/Head component
 * Renders children directly for testing purposes
 */
export default function Head({ children }: HeadProps): ReactNode {
  return <>{children}</>;
}
