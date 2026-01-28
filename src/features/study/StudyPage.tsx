import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button";
import Panel from "../../components/Panel";
import Progress from "../../components/Progress";
import { useAppStore } from "../../store/useAppStore";
import { useToast } from "../../components/ToastProvider";

const StudyPage = () => {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const deck = useAppStore((state) => {
    const activeId = state.activeUserId;
    if (!activeId) return undefined;
    return state.data[activeId]?.decks.find((item) => item.id === deckId);
  });
  const getDueCards = useAppStore((state) => state.getDueCards);
  const getNewCards = useAppStore((state) => state.getNewCards);
  const reviewCard = useAppStore((state) => state.reviewCard);
  const { addToast } = useToast();

  const sessionCards = useAppStore((state) => {
    if (!deckId) return [];
    const due = state.getDueCards(deckId);
    if (due.length > 0) return due;
    return state.getNewCards(deckId);
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);

  useEffect(() => {
    setCurrentIndex(0);
    setShowBack(false);
  }, [deckId]);

  if (!deck) {
    return (
      <Panel>
        <p className="text-slate-300">Deck não encontrado.</p>
        <Button variant="secondary" onClick={() => navigate("/decks")}>Voltar</Button>
      </Panel>
    );
  }

  const total = sessionCards.length;
  const current = sessionCards[currentIndex];

  const handleAnswer = useCallback(
    (rating: "again" | "hard" | "good" | "easy") => {
      if (!current) return;
      reviewCard(current.id, rating);
      const nextIndex = currentIndex + 1;
      if (nextIndex >= total) {
        addToast("Sessão concluída!", "success");
        setShowBack(false);
        setCurrentIndex(0);
        return;
      }
      setCurrentIndex(nextIndex);
      setShowBack(false);
    },
    [addToast, current, currentIndex, reviewCard, total],
  );

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (!showBack) return;
      if (event.key === "1") handleAnswer("again");
      if (event.key === "2") handleAnswer("hard");
      if (event.key === "3") handleAnswer("good");
      if (event.key === "4") handleAnswer("easy");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleAnswer, showBack]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">Study Session</h1>
        <p className="text-slate-400">Deck: {deck.name}</p>
      </div>

      <Panel>
        {total === 0 ? (
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-white">Sem cards disponíveis</h2>
            <p className="text-sm text-slate-400">
              Não há cards vencidos ou novos neste deck no momento.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>
                {currentIndex + 1}/{total}
              </span>
              <span>{deck.language}</span>
            </div>
            <Progress value={currentIndex + 1} max={total} />
            <div className="rounded-2xl border border-panel-border bg-panel-light p-6 text-center">
              <p className="text-2xl font-semibold text-white">{current?.front}</p>
              {showBack && (
                <div className="mt-4 space-y-2 text-sm text-slate-200">
                  <p className="text-lg font-semibold">{current?.back}</p>
                  {current?.romanization && <p>{current.romanization}</p>}
                  {current?.example && <p className="text-slate-400">{current.example}</p>}
                </div>
              )}
            </div>
            {!showBack ? (
              <div className="flex justify-center">
                <Button onClick={() => setShowBack(true)} aria-label="Mostrar resposta">
                  Mostrar resposta
                </Button>
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-4">
                <Button variant="danger" onClick={() => handleAnswer("again")}>
                  Errei (1)
                </Button>
                <Button variant="secondary" onClick={() => handleAnswer("hard")}>
                  Difícil (2)
                </Button>
                <Button variant="primary" onClick={() => handleAnswer("good")}>
                  Bom (3)
                </Button>
                <Button variant="secondary" onClick={() => handleAnswer("easy")}>
                  Fácil (4)
                </Button>
              </div>
            )}
          </div>
        )}
      </Panel>

      <Panel>
        <h2 className="text-lg font-semibold text-white">Sessão rápida</h2>
        <p className="text-sm text-slate-400">Pressione 1-4 no teclado após revelar o verso.</p>
        <div className="mt-4 flex gap-3">
          <Button variant="secondary" onClick={() => navigate(`/decks/${deck.id}`)}>
            Voltar ao deck
          </Button>
          <Button variant="primary" onClick={() => navigate("/decks")}>Ver decks</Button>
        </div>
      </Panel>
    </div>
  );
};

export default StudyPage;
