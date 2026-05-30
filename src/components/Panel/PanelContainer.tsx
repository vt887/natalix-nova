import { createPortal } from 'react-dom';
import type { ReactElement } from 'react';

import { useStore } from '../../store';
import { BackgroundPanel } from '../../features/background/BackgroundPanel';

function closePanel(): void {
  useStore.getState().setActivePanel(null);
}

export function PanelContainer(): ReactElement | null {
  const activePanel = useStore((state) => state.activePanel);
  const host = document.getElementById('panel-root');

  if (!host || !activePanel) {
    return null;
  }

  return createPortal(
    <div
      aria-hidden="false"
      className="panel-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          closePanel();
        }
      }}
    >
      {activePanel === 'background' ? <BackgroundPanel onClose={closePanel} /> : null}
    </div>,
    host,
  );
}
