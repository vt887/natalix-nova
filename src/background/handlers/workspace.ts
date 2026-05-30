import type {
  WorkspaceDeleteMessage,
  WorkspaceRestoreMessage,
  WorkspaceSaveMessage,
} from '../../types/messages';

export async function handleWorkspaceSave(_message: WorkspaceSaveMessage): Promise<unknown> {
  return { error: 'not implemented' } as const;
}

export async function handleWorkspaceRestore(_message: WorkspaceRestoreMessage): Promise<unknown> {
  return { error: 'not implemented' } as const;
}

export async function handleWorkspaceDelete(_message: WorkspaceDeleteMessage): Promise<unknown> {
  return { error: 'not implemented' } as const;
}

