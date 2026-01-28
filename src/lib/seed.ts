import { formatDateKey, startOfDay } from "./date";
import { createId } from "./id";
import { AppState, Card, Deck, LanguageCode } from "../types";

const todayIso = () => startOfDay(new Date()).toISOString();

const createDeck = (name: string, language: LanguageCode, description?: string): Deck => ({
  id: createId(),
  name,
  language,
  description,
  createdAt: new Date().toISOString(),
});

const createCard = (
  deckId: string,
  front: string,
  back: string,
  options: { example?: string; tags?: string[]; romanization?: string } = {},
): Card => ({
  id: createId(),
  deckId,
  front,
  back,
  example: options.example,
  tags: options.tags,
  romanization: options.romanization,
  createdAt: new Date().toISOString(),
  stats: {
    repetitions: 0,
    ease: 2.5,
    intervalDays: 0,
    dueDate: todayIso(),
  },
});

export const seedState = (version: number): AppState => {
  const english = createDeck("English Basics", "EN", "Fundamentals for daily communication.");
  const japanese = createDeck("日本語 Partículas", "JA", "Partículas essenciais do japonês.");
  const korean = createDeck("한국어 Hangul", "KO", "Consoantes e vogais básicas.");
  const chinese = createDeck("中文 HSK1", "ZH", "Vocabulário inicial do HSK1.");

  const decks = [english, japanese, korean, chinese];
  const cards: Card[] = [
    createCard(english.id, "Hello", "Olá", { example: "Hello, nice to meet you.", tags: ["saudação"] }),
    createCard(english.id, "Thank you", "Obrigado", { example: "Thank you for your help.", tags: ["gratitude"] }),
    createCard(english.id, "Please", "Por favor", { example: "Please sit down.", tags: ["polite"] }),
    createCard(english.id, "Good morning", "Bom dia", { example: "Good morning, team!" }),
    createCard(english.id, "How are you?", "Como você está?", { example: "How are you today?" }),
    createCard(english.id, "Excuse me", "Com licença", { example: "Excuse me, where is the station?" }),
    createCard(english.id, "I understand", "Eu entendo", { example: "I understand the instructions." }),
    createCard(english.id, "Could you repeat?", "Pode repetir?", { example: "Could you repeat that, please?" }),
    createCard(japanese.id, "は", "tópico (wa)", {
      romanization: "wa",
      example: "わたしは学生です。\nWatashi wa gakusei desu.",
      tags: ["partícula"],
    }),
    createCard(japanese.id, "が", "sujeito (ga)", {
      romanization: "ga",
      example: "ねこが好きです。\nNeko ga suki desu.",
      tags: ["partícula"],
    }),
    createCard(japanese.id, "を", "objeto direto (o)", {
      romanization: "o",
      example: "パンを食べます。\nPan o tabemasu.",
    }),
    createCard(japanese.id, "に", "direção/tempo (ni)", {
      romanization: "ni",
      example: "学校に行きます。\nGakkou ni ikimasu.",
    }),
    createCard(japanese.id, "へ", "direção (e)", {
      romanization: "e",
      example: "うちへ帰ります。\nUchi e kaerimasu.",
    }),
    createCard(japanese.id, "で", "local/ação (de)", {
      romanization: "de",
      example: "カフェで勉強します。\nKafe de benkyou shimasu.",
    }),
    createCard(japanese.id, "と", "e/com (to)", {
      romanization: "to",
      example: "友だちと話します。\nTomodachi to hanashimasu.",
    }),
    createCard(japanese.id, "も", "também (mo)", {
      romanization: "mo",
      example: "私も行きます。\nWatashi mo ikimasu.",
    }),
    createCard(korean.id, "ㄱ", "consoante g/k", {
      romanization: "g/k",
      example: "가방 (gabang) = bolsa",
    }),
    createCard(korean.id, "ㄴ", "consoante n", {
      romanization: "n",
      example: "나라 (nara) = país",
    }),
    createCard(korean.id, "ㄷ", "consoante d/t", {
      romanization: "d/t",
      example: "달 (dal) = lua",
    }),
    createCard(korean.id, "ㅏ", "vogal a", {
      romanization: "a",
      example: "가 (ga)",
    }),
    createCard(korean.id, "ㅓ", "vogal eo", {
      romanization: "eo",
      example: "거 (geo)",
    }),
    createCard(korean.id, "ㅗ", "vogal o", {
      romanization: "o",
      example: "고 (go)",
    }),
    createCard(korean.id, "ㅜ", "vogal u", {
      romanization: "u",
      example: "구 (gu)",
    }),
    createCard(korean.id, "ㅣ", "vogal i", {
      romanization: "i",
      example: "이 (i)",
    }),
    createCard(chinese.id, "你好", "Olá", {
      romanization: "nǐ hǎo",
      example: "你好！很高兴认识你。",
    }),
    createCard(chinese.id, "谢谢", "Obrigado", {
      romanization: "xièxie",
      example: "谢谢你的帮助。",
    }),
    createCard(chinese.id, "再见", "Tchau", {
      romanization: "zài jiàn",
      example: "明天见，再见。",
    }),
    createCard(chinese.id, "是", "ser/estar", {
      romanization: "shì",
      example: "我是学生。",
    }),
    createCard(chinese.id, "不", "não", {
      romanization: "bù",
      example: "我不累。",
    }),
    createCard(chinese.id, "有", "ter", {
      romanization: "yǒu",
      example: "我有两本书。",
    }),
    createCard(chinese.id, "喜欢", "gostar", {
      romanization: "xǐhuan",
      example: "我喜欢学习中文。",
    }),
    createCard(chinese.id, "今天", "hoje", {
      romanization: "jīntiān",
      example: "今天很忙。",
    }),
  ];

  const dateKey = formatDateKey(new Date());

  return {
    version,
    decks,
    cards,
    settings: {
      dailyGoal: 20,
    },
    dailyLogs: [
      {
        date: dateKey,
        totalReviews: 0,
        byDeck: {},
      },
    ],
  };
};
