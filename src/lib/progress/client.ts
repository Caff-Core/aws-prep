import { LocalProgressRepository } from './repository';
import type { ProgressState } from './types';

export const PROGRESS_CHANGED_EVENT = 'progress:changed';

function browserStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export const progressRepository = new LocalProgressRepository(browserStorage());

/** Reads fresh state before each change so other open tabs are not overwritten. */
export async function updateProgress(
  change: (state: ProgressState) => ProgressState,
): Promise<ProgressState> {
  const next = change(await progressRepository.load());
  await progressRepository.save(next);
  document.dispatchEvent(new CustomEvent(PROGRESS_CHANGED_EVENT));
  return next;
}
