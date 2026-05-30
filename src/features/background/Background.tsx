import type { ReactElement } from 'react';

import { useBackground } from './useBackground';

export function Background(): ReactElement {
  const background = useBackground();

  return (
    <div
      aria-hidden="true"
      id="page-bg"
      style={{
        backgroundImage: `url(${background.url})`,
      }}
    />
  );
}
