import { runtime } from '../../services/browser/runtime';

export interface BackgroundPreset {
  id: string;
  label: string;
  url: string;
}

export const BACKGROUND_PRESETS: BackgroundPreset[] = Array.from({ length: 52 }, (_, index) => {
  const n = String(index + 1).padStart(2, '0');
  return {
    id: n,
    label: `Preset ${n}`,
    url: runtime.getURL(`img/backgrounds/${n}.jpg`),
  };
});

