import type { ReactElement } from 'react';

import { Background } from './features/background/Background';
import { useTheme } from './hooks/useTheme';
import { LeftToolbar } from './components/LeftToolbar/LeftToolbar';
import { PanelContainer } from './components/Panel/PanelContainer';

export function App(): ReactElement {
  useTheme();

  return (
    <>
      <Background />
      <LeftToolbar />
      <div id="page">
        <main id="shell" aria-label="New tab shell">
          <section id="search-area">
            <div className="placeholder-zone" style={{ width: 'min(100%, 880px)', height: 72 }} />
          </section>

          <section id="app-grid-area">
            <div className="placeholder-zone" style={{ width: 'min(100%, 920px)', height: 320 }} />
          </section>

          <section id="widget-area">
            <div className="placeholder-zone" style={{ width: 'min(100%, 460px)', height: 180 }} />
          </section>
        </main>
      </div>
      <PanelContainer />
    </>
  );
}
