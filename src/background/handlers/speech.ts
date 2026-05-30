import type {
  SpeechErrorMessage,
  SpeechResultMessage,
  SpeechStartMessage,
  SpeechStopMessage,
} from '../../types/messages';

export async function handleSpeechStart(_message: SpeechStartMessage): Promise<unknown> {
  return { error: 'not implemented' } as const;
}

export async function handleSpeechStop(_message: SpeechStopMessage): Promise<unknown> {
  return { error: 'not implemented' } as const;
}

export async function handleSpeechResult(_message: SpeechResultMessage): Promise<unknown> {
  return { error: 'not implemented' } as const;
}

export async function handleSpeechError(_message: SpeechErrorMessage): Promise<unknown> {
  return { error: 'not implemented' } as const;
}

