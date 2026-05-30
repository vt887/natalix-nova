export interface UISlice {
  activePanel: string | null;
  focusMode: boolean;
  setActivePanel: (panel: string | null) => void;
}

export const uiInitialState: UISlice = {
  activePanel: null,
  focusMode: false,
  setActivePanel: () => undefined,
};
