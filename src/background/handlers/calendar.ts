import type {
  CalendarAuthorizeMessage,
  CalendarGetEventsMessage,
  CalendarIsAuthorizedMessage,
} from '../../types/messages';

export async function handleCalendarIsAuthorized(
  _message: CalendarIsAuthorizedMessage,
): Promise<unknown> {
  return { error: 'not implemented' } as const;
}

export async function handleCalendarAuthorize(_message: CalendarAuthorizeMessage): Promise<unknown> {
  return { error: 'not implemented' } as const;
}

export async function handleCalendarGetEvents(_message: CalendarGetEventsMessage): Promise<unknown> {
  return { error: 'not implemented' } as const;
}

