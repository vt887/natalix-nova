import React from 'react';
import { createRoot } from 'react-dom/client';

import './styles/reset.css';
import './styles/tokens.css';
import './styles/global.css';
import './styles/legacy/style.css';
import './styles/legacy/themes.css';
import './styles/legacy/panels.css';
import './styles/legacy/widgets.css';
import './styles/legacy/weather.css';
import './styles/legacy/search_extra.css';
import './styles/legacy/recently_closed.css';
import './styles/legacy/context_menu.css';
import './styles/themes/dark.css';
import './styles/themes/light.css';
import './styles/themes/midnight.css';
import './styles/themes/solarized.css';

import { App } from './App';

const rootEl = document.getElementById('root');

if (rootEl) {
  createRoot(rootEl).render(
    React.createElement(React.StrictMode, null, React.createElement(App)),
  );
}

