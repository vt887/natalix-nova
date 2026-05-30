export interface IntegrationsSlice {
  github: unknown | null;
  drive: unknown | null;
  todoist: unknown | null;
  notion: unknown | null;
}

export const integrationsInitialState: IntegrationsSlice = {
  github: null,
  drive: null,
  todoist: null,
  notion: null,
};

