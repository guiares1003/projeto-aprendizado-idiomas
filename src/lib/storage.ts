import { AppState } from "../types";
import { seedState } from "./seed";

const STORAGE_KEY = "polytrack_state";
const CURRENT_VERSION = 1;

export const loadState = (): AppState => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return seedState(CURRENT_VERSION);
  }
  try {
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed.version || parsed.version !== CURRENT_VERSION) {
      return migrateState(parsed);
    }
    return parsed;
  } catch {
    return seedState(CURRENT_VERSION);
  }
};

export const saveState = (state: AppState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const migrateState = (oldState: Partial<AppState>): AppState => {
  const base = seedState(CURRENT_VERSION);
  return {
    ...base,
    ...oldState,
    version: CURRENT_VERSION,
    decks: oldState.decks ?? base.decks,
    cards: oldState.cards ?? base.cards,
    settings: oldState.settings ?? base.settings,
    dailyLogs: oldState.dailyLogs ?? base.dailyLogs,
  };
};

export const clearState = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const STORAGE_VERSION = CURRENT_VERSION;
