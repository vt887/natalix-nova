import type { BackupExportMessage, BackupImportMessage } from '../../types/messages';

export async function handleBackupExport(_message: BackupExportMessage): Promise<unknown> {
  return { error: 'not implemented' } as const;
}

export async function handleBackupImport(_message: BackupImportMessage): Promise<unknown> {
  return { error: 'not implemented' } as const;
}

