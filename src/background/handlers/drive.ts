import type { DriveAuthorizeMessage, DriveFetchMessage } from '../../types/messages';

export async function handleDriveFetch(_message: DriveFetchMessage): Promise<unknown> {
  return { error: 'not implemented' } as const;
}

export async function handleDriveAuthorize(_message: DriveAuthorizeMessage): Promise<unknown> {
  return { error: 'not implemented' } as const;
}

