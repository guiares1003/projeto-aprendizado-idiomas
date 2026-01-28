import { AppState, RootState } from "../types";
import { seedState } from "./seed";

const STORAGE_KEY = "polytrack_state";
const CURRENT_VERSION = 2;

const createEmptyRoot = (): RootState => ({
  version: CURRENT_VERSION,
  users: [],
  activeUserId: undefined,
  data: {},
});

export const loadState = (): RootState => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return createEmptyRoot();
  }
  try {
    const parsed = JSON.parse(raw) as Partial<RootState> | Partial<AppState>;
    if ("decks" in parsed) {
      return migrateState(parsed as Partial<AppState>);
    }
    if (!parsed.version || parsed.version !== CURRENT_VERSION) {
      return migrateState(parsed as Partial<AppState>);
    }
    return parsed as RootState;
  } catch {
    return createEmptyRoot();
  }
};

export const saveState = (state: RootState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const migrateState = (oldState: Partial<AppState>): RootState => {
  const base = seedState(CURRENT_VERSION);
  const legacyUserId = "legacy-user";
  const legacyUser = {
    id: legacyUserId,
    name: "Usuário",
    email: "legacy@local",
    passwordHash: "legacy",
    createdAt: new Date().toISOString(),
  };
  return {
    version: CURRENT_VERSION,
    users: [legacyUser],
    activeUserId: legacyUserId,
    data: {
      [legacyUserId]: {
        ...base,
        ...oldState,
        version: CURRENT_VERSION,
        decks: oldState.decks ?? base.decks,
        cards: oldState.cards ?? base.cards,
        settings: oldState.settings ?? base.settings,
        dailyLogs: oldState.dailyLogs ?? base.dailyLogs,
      },
    },
  };
};

export const clearState = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const STORAGE_VERSION = CURRENT_VERSION;
