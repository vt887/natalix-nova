import { Image, LayoutGrid, Settings2, Sparkles } from 'lucide-react';
import type { ReactElement } from 'react';

import { useStore } from '../../store';

const BUTTONS = [
  { id: 'background', title: 'Background', icon: Image, action: 'background' as const },
  { id: 'theme', title: 'Theme', icon: Sparkles, action: null },
  { id: 'apps', title: 'Apps', icon: LayoutGrid, action: null },
  { id: 'settings', title: 'Settings', icon: Settings2, action: null },
] as const;

export function LeftToolbar(): ReactElement {
  const setActivePanel = useStore((state) => state.setActivePanel);

  return (
    <aside id="left-toolbar" aria-label="Toolbar">
      <div id="left-toolbar-top">
        {BUTTONS.map((button) => {
          const Icon = button.icon;
          return (
            <button
              key={button.id}
              className="tbar-btn btn-40"
              data-title={button.title}
              data-testid={`toolbar-${button.id}`}
              type="button"
              onClick={() => {
                if (button.action === 'background') {
                  setActivePanel('background');
                }
              }}
            >
              <Icon aria-hidden="true" size={18} strokeWidth={1.9} />
            </button>
          );
        })}
      </div>
      <div id="left-toolbar-bottom" />
    </aside>
  );
}
