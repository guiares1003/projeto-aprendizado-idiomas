import { AppState } from "../types";

export type ValidationResult = {
  valid: boolean;
  errors: string[];
};

export const validateState = (value: unknown): ValidationResult => {
  const errors: string[] = [];
  if (!value || typeof value !== "object") {
    return { valid: false, errors: ["JSON inválido."] };
  }
  const state = value as Partial<AppState>;
  if (!Array.isArray(state.decks)) errors.push("Campo decks deve ser uma lista.");
  if (!Array.isArray(state.cards)) errors.push("Campo cards deve ser uma lista.");
  if (!state.settings || typeof state.settings.dailyGoal !== "number") {
    errors.push("Campo settings.dailyGoal é obrigatório.");
  }
  if (!Array.isArray(state.dailyLogs)) errors.push("Campo dailyLogs deve ser uma lista.");
  return { valid: errors.length === 0, errors };
};
