import type { AppItem } from '../../types/backup';

export interface AppsSlice {
  apps: AppItem[];
}

export const appsInitialState: AppsSlice = {
  apps: [],
};

