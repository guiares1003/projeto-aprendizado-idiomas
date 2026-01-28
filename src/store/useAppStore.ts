import { create } from "zustand";
import { addDays, formatDateKey, isDue, startOfDay } from "../lib/date";
import { createId } from "../lib/id";
import { loadState, saveState, STORAGE_VERSION } from "../lib/storage";
import { AppState, Card, CardStats, DailyLog, Deck } from "../types";

export type ReviewRating = "again" | "hard" | "good" | "easy";

type AppStore = AppState & {
  addDeck: (input: Omit<Deck, "id" | "createdAt">) => Deck;
  updateDeck: (id: string, updates: Partial<Omit<Deck, "id" | "createdAt">>) => void;
  deleteDeck: (id: string) => void;
  addCard: (input: Omit<Card, "id" | "createdAt" | "stats">) => Card;
  updateCard: (id: string, updates: Partial<Omit<Card, "id" | "deckId" | "createdAt">>) => void;
  deleteCard: (id: string) => void;
  reviewCard: (id: string, rating: ReviewRating) => void;
  setDailyGoal: (goal: number) => void;
  importState: (state: AppState, mode: "merge" | "replace") => void;
  getDueCards: (deckId: string) => Card[];
  getNewCards: (deckId: string) => Card[];
};

const initialState = loadState();

const defaultStats = (): CardStats => ({
  repetitions: 0,
  ease: 2.5,
  intervalDays: 0,
  dueDate: startOfDay(new Date()).toISOString(),
});

const applyReview = (stats: CardStats, rating: ReviewRating): CardStats => {
  const today = startOfDay(new Date());
  let { repetitions, ease, intervalDays } = stats;

  if (rating === "again") {
    repetitions = 0;
    intervalDays = 1;
    ease = Math.max(1.3, ease - 0.2);
  }

  if (rating === "hard") {
    repetitions += 1;
    intervalDays = Math.max(1, Math.round(intervalDays * 1.2));
    ease = Math.max(1.3, ease - 0.05);
  }

  if (rating === "good") {
    repetitions += 1;
    intervalDays = Math.max(2, Math.round(intervalDays * ease));
  }

  if (rating === "easy") {
    repetitions += 1;
    intervalDays = Math.max(3, Math.round(intervalDays * ease * 1.3));
    ease = ease + 0.05;
  }

  const dueDate = startOfDay(addDays(today, intervalDays)).toISOString();
  return {
    repetitions,
    ease,
    intervalDays,
    dueDate,
    lastReview: today.toISOString(),
  };
};

const upsertDailyLog = (logs: DailyLog[], deckId: string): DailyLog[] => {
  const dateKey = formatDateKey(new Date());
  const existing = logs.find((log) => log.date === dateKey);
  if (!existing) {
    return [
      ...logs,
      {
        date: dateKey,
        totalReviews: 1,
        byDeck: { [deckId]: 1 },
      },
    ];
  }
  return logs.map((log) => {
    if (log.date !== dateKey) return log;
    const nextByDeck = { ...log.byDeck };
    nextByDeck[deckId] = (nextByDeck[deckId] ?? 0) + 1;
    return {
      ...log,
      totalReviews: log.totalReviews + 1,
      byDeck: nextByDeck,
    };
  });
};

export const useAppStore = create<AppStore>((set, get) => ({
  ...initialState,
  addDeck: (input) => {
    const deck: Deck = {
      id: createId(),
      createdAt: new Date().toISOString(),
      ...input,
    };
    set((state) => ({ decks: [...state.decks, deck] }));
    return deck;
  },
  updateDeck: (id, updates) => {
    set((state) => ({
      decks: state.decks.map((deck) => (deck.id === id ? { ...deck, ...updates } : deck)),
    }));
  },
  deleteDeck: (id) => {
    set((state) => ({
      decks: state.decks.filter((deck) => deck.id !== id),
      cards: state.cards.filter((card) => card.deckId !== id),
    }));
  },
  addCard: (input) => {
    const card: Card = {
      id: createId(),
      createdAt: new Date().toISOString(),
      stats: defaultStats(),
      ...input,
    };
    set((state) => ({ cards: [...state.cards, card] }));
    return card;
  },
  updateCard: (id, updates) => {
    set((state) => ({
      cards: state.cards.map((card) => (card.id === id ? { ...card, ...updates } : card)),
    }));
  },
  deleteCard: (id) => {
    set((state) => ({ cards: state.cards.filter((card) => card.id !== id) }));
  },
  reviewCard: (id, rating) => {
    const card = get().cards.find((item) => item.id === id);
    if (!card) return;
    const updated = applyReview(card.stats, rating);
    set((state) => ({
      cards: state.cards.map((item) => (item.id === id ? { ...item, stats: updated } : item)),
      dailyLogs: upsertDailyLog(state.dailyLogs, card.deckId),
    }));
  },
  setDailyGoal: (goal) => {
    set((state) => ({
      settings: {
        ...state.settings,
        dailyGoal: goal,
      },
    }));
  },
  importState: (state, mode) => {
    if (mode === "replace") {
      set({
        ...state,
        version: STORAGE_VERSION,
      });
      return;
    }
    set((current) => ({
      version: STORAGE_VERSION,
      decks: [...current.decks, ...state.decks],
      cards: [...current.cards, ...state.cards],
      settings: { ...current.settings, ...state.settings },
      dailyLogs: [...current.dailyLogs, ...state.dailyLogs],
    }));
  },
  getDueCards: (deckId) => {
    return get().cards.filter((card) => card.deckId === deckId && isDue(card.stats.dueDate));
  },
  getNewCards: (deckId) => {
    return get().cards.filter((card) => card.deckId === deckId && card.stats.repetitions === 0);
  },
}));

useAppStore.subscribe((state) => {
  const persisted: AppState = {
    version: state.version,
    decks: state.decks,
    cards: state.cards,
    settings: state.settings,
    dailyLogs: state.dailyLogs,
  };
  saveState(persisted);
});
