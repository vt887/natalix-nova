import type { Workspace } from '../../types/backup';

export interface WorkspacesSlice {
  workspaces: Workspace[];
}

export const workspacesInitialState: WorkspacesSlice = {
  workspaces: [],
};

