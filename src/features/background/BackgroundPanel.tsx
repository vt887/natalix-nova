import { useRef } from 'react';
import type { ReactElement } from 'react';

import { storage } from '../../services/browser/storage';
import { STORAGE_KEYS } from '../../types/storage';
import { useStore } from '../../store';
import { BACKGROUND_PRESETS } from './presets';
import { useBackground } from './useBackground';

import type { BackgroundConfig } from '../../store/slices/settings';

async function readFileAsDataUrl(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        reject(new Error('Unexpected file reader result'));
        return;
      }
      resolve(result);
    };
    reader.readAsDataURL(file);
  });
}

export function BackgroundPanel(props: { onClose: () => void }): ReactElement {
  const current = useBackground();
  const setBackground = useStore((state) => state.setBackground);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <section className="panel-shell frostable" data-testid="background-panel">
      <header className="panel-shell__header">
        <div>
          <h2 className="panel-shell__title">Background</h2>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>
            Preset backgrounds and a custom upload slot.
          </div>
        </div>
        <button
          aria-label="Close background panel"
          className="panel-shell__close"
          type="button"
          onClick={props.onClose}
        >
          x
        </button>
      </header>

      <div className="panel-shell__body">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: 12,
            maxHeight: 'calc(100vh - 160px)',
            overflow: 'auto',
            paddingRight: 4,
          }}
        >
          {BACKGROUND_PRESETS.map((preset) => {
            const selected =
              current.type === 'preset' && current.url === preset.url ? 'true' : undefined;
            return (
              <button
                key={preset.id}
                aria-pressed={selected === 'true'}
                data-testid={`background-preset-${preset.id}`}
                type="button"
                onClick={async () => {
                  const next: BackgroundConfig = {
                    type: 'preset',
                    url: preset.url,
                    label: preset.label,
                  };
                  await storage.set(STORAGE_KEYS.settingsBackground, next);
                  setBackground(next);
                }}
                style={{
                  height: 96,
                  borderRadius: 16,
                  border: `1px solid ${
                    selected === 'true'
                      ? 'var(--color-accent-primary)'
                      : 'var(--color-border-soft)'
                  }`,
                  backgroundImage: `url(${preset.url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  boxShadow: 'var(--shadow-soft)',
                  cursor: 'pointer',
                }}
                title={preset.label}
              />
            );
          })}
        </div>

        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <button
            className="tbar-btn"
            type="button"
            onClick={() => {
              fileInputRef.current?.click();
            }}
            style={{ width: 180, borderRadius: 999 }}
          >
            Upload custom
          </button>
          <input
            ref={fileInputRef}
            accept="image/*"
            aria-label="Upload custom background"
            hidden
            type="file"
            onChange={async (event) => {
              const file = event.currentTarget.files?.[0];
              event.currentTarget.value = '';
              if (!file) return;
              const dataUrl = await readFileAsDataUrl(file);
              const next: BackgroundConfig = {
                type: 'custom',
                url: dataUrl,
                label: file.name,
              };
              await storage.set(STORAGE_KEYS.settingsBackground, next);
              setBackground(next);
            }}
          />
        </div>
      </div>
    </section>
  );
}
