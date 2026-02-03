import type { ReactNode } from 'react';

interface DocItemProps {
  content?: unknown;
  [key: string]: unknown;
}

/**
 * Mock for @theme-original/DocItem component
 * Renders a simple div for testing purposes
 */
export default function DocItem(props: DocItemProps): ReactNode {
  return <div data-testid="original-doc-item" data-props={JSON.stringify(props)} />;
}
