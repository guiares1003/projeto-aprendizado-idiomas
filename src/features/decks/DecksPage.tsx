import { Link } from "react-router-dom";
import Button from "../../components/Button";
import Panel from "../../components/Panel";
import Badge from "../../components/Badge";
import { useAppStore } from "../../store/useAppStore";
import { isDue } from "../../lib/date";

const DecksPage = () => {
  const decks = useAppStore((state) => state.decks);
  const cards = useAppStore((state) => state.cards);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">Decks</h1>
          <p className="text-slate-400">Organize seus decks por idioma e tema.</p>
        </div>
        <Button asChild>
          <Link to="/decks/new">Novo deck</Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {decks.map((deck) => {
          const deckCards = cards.filter((card) => card.deckId === deck.id);
          const due = deckCards.filter((card) => isDue(card.stats.dueDate)).length;
          return (
            <Panel key={deck.id} className="flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">{deck.name}</h2>
                  <Badge label={deck.language} tone="info" />
                </div>
                {deck.description && <p className="text-sm text-slate-300">{deck.description}</p>}
                <div className="flex flex-wrap gap-3 text-sm text-slate-400">
                  <span>{deckCards.length} cards</span>
                  <span>{due} vencidos</span>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button variant="secondary" asChild>
                  <Link to={`/decks/${deck.id}`}>Gerenciar</Link>
                </Button>
                <Button variant="primary" asChild>
                  <Link to={`/study/${deck.id}`}>Estudar</Link>
                </Button>
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
};

export default DecksPage;
