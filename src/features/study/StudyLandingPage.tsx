import { Link } from "react-router-dom";
import Panel from "../../components/Panel";
import Button from "../../components/Button";
import { useAppStore } from "../../store/useAppStore";
import { isDue } from "../../lib/date";

const StudyLandingPage = () => {
  const decks = useAppStore((state) => state.decks);
  const cards = useAppStore((state) => state.cards);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">Study</h1>
        <p className="text-slate-400">Escolha um deck para iniciar sua sessão.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {decks.map((deck) => {
          const deckCards = cards.filter((card) => card.deckId === deck.id);
          const dueCount = deckCards.filter((card) => isDue(card.stats.dueDate)).length;
          return (
            <Panel key={deck.id} className="flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">{deck.name}</h2>
                <p className="text-sm text-slate-400">{deckCards.length} cards</p>
                <p className="text-sm text-slate-400">{dueCount} vencidos hoje</p>
              </div>
              <Button variant="primary" asChild className="mt-4">
                <Link to={`/study/${deck.id}`}>Iniciar estudo</Link>
              </Button>
            </Panel>
          );
        })}
      </div>
    </div>
  );
};

export default StudyLandingPage;
