export interface UISlice {
  activePanel: string | null;
  focusMode: boolean;
}

export const uiInitialState: UISlice = {
  activePanel: null,
  focusMode: false,
};

