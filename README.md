# PolyTrack

PolyTrack é um web app de estudo de idiomas com flashcards, revisão espaçada, metas diárias e estatísticas. Ele funciona totalmente offline com armazenamento local.

## Stack
- React + Vite + TypeScript
- TailwindCSS
- React Router
- Zustand
- Recharts

## Requisitos
- Node.js 18+
- npm 9+

## Instalação
```bash
npm install
```

## Rodar em desenvolvimento
```bash
npm run dev
```

## Build para produção
```bash
npm run build
```

## Preview local
```bash
npm run preview
```

## Qualidade
```bash
npm run lint
npm run format
```

## Dados locais
Os dados são persistidos no `LocalStorage` com versão de schema. Ao primeiro cadastro, o app cria 4 decks de demonstração.

## Login local
O app possui cadastro e login locais (sem backend). Cada usuário mantém seus decks e revisões separados dentro do navegador.
