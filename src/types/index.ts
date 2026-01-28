import type { User } from "./auth";

export type LanguageCode = "EN" | "JA" | "KO" | "ZH";

export type Deck = {
  id: string;
  name: string;
  language: LanguageCode;
  description?: string;
  createdAt: string;
};

export type CardStats = {
  repetitions: number;
  ease: number;
  intervalDays: number;
  dueDate: string;
  lastReview?: string;
};

export type Card = {
  id: string;
  deckId: string;
  front: string;
  back: string;
  example?: string;
  tags?: string[];
  romanization?: string;
  createdAt: string;
  stats: CardStats;
};

export type DailyLog = {
  date: string;
  totalReviews: number;
  byDeck: Record<string, number>;
  estimatedMinutes?: number;
};

export type Settings = {
  dailyGoal: number;
};

export type AppState = {
  version: number;
  decks: Deck[];
  cards: Card[];
  settings: Settings;
  dailyLogs: DailyLog[];
};

export type RootState = {
  version: number;
  users: User[];
  activeUserId?: string;
  data: Record<string, AppState>;
};
