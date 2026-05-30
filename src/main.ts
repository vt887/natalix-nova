import React from 'react';
import { createRoot } from 'react-dom/client';

import './styles/reset.css';
import './styles/tokens.css';
import './styles/global.css';
import './styles/themes/dark.css';
import './styles/themes/light.css';
import './styles/themes/midnight.css';
import './styles/themes/solarized.css';

// PR-01: no visible UI. Keep the page blank, but ensure the app bundle loads cleanly.
function App(): React.ReactNode {
  return null;
}

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(React.createElement(App));
}
