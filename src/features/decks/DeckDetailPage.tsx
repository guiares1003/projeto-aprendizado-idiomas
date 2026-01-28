import { FormEvent, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button";
import Panel from "../../components/Panel";
import Badge from "../../components/Badge";
import Modal from "../../components/Modal";
import { Input, Textarea } from "../../components/Input";
import { useAppStore } from "../../store/useAppStore";
import { Card as CardType, LanguageCode } from "../../types";
import { useToast } from "../../components/ToastProvider";

const DeckDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const deck = useAppStore((state) => state.decks.find((item) => item.id === id));
  const cards = useAppStore((state) => state.cards.filter((card) => card.deckId === id));
  const updateDeck = useAppStore((state) => state.updateDeck);
  const deleteDeck = useAppStore((state) => state.deleteDeck);
  const addCard = useAppStore((state) => state.addCard);
  const updateCard = useAppStore((state) => state.updateCard);
  const deleteCard = useAppStore((state) => state.deleteCard);

  const [name, setName] = useState(deck?.name ?? "");
  const [language, setLanguage] = useState<LanguageCode>(deck?.language ?? "EN");
  const [description, setDescription] = useState(deck?.description ?? "");
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [example, setExample] = useState("");
  const [romanization, setRomanization] = useState("");
  const [tags, setTags] = useState("");
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CardType | null>(null);

  const availableTags = useMemo(() => {
    const set = new Set<string>();
    cards.forEach((card) => card.tags?.forEach((tag) => set.add(tag)));
    return Array.from(set).sort();
  }, [cards]);

  const filteredCards = cards.filter((card) => {
    const content = `${card.front} ${card.back} ${card.example ?? ""} ${card.romanization ?? ""}`.toLowerCase();
    const matchesSearch = content.includes(search.toLowerCase());
    const matchesTag = tagFilter ? card.tags?.includes(tagFilter) : true;
    return matchesSearch && matchesTag;
  });

  if (!deck) {
    return (
      <Panel>
        <p className="text-slate-300">Deck não encontrado.</p>
        <Button variant="secondary" onClick={() => navigate("/decks")}>Voltar</Button>
      </Panel>
    );
  }

  const handleDeckUpdate = (event: FormEvent) => {
    event.preventDefault();
    updateDeck(deck.id, {
      name: name.trim(),
      language,
      description: description.trim() || undefined,
    });
    addToast("Deck atualizado!", "success");
  };

  const handleAddCard = (event: FormEvent) => {
    event.preventDefault();
    if (!front.trim() || !back.trim()) return;
    const tagsList = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    addCard({
      deckId: deck.id,
      front: front.trim(),
      back: back.trim(),
      example: example.trim() || undefined,
      romanization: romanization.trim() || undefined,
      tags: tagsList.length ? tagsList : undefined,
    });
    setFront("");
    setBack("");
    setExample("");
    setRomanization("");
    setTags("");
    addToast("Card adicionado!", "success");
  };

  const handleDeleteDeck = () => {
    deleteDeck(deck.id);
    addToast("Deck excluído.", "success");
    navigate("/decks");
  };

  const handleEditSave = () => {
    if (!editingCard) return;
    updateCard(editingCard.id, {
      front: editingCard.front,
      back: editingCard.back,
      example: editingCard.example,
      romanization: editingCard.romanization,
      tags: editingCard.tags,
    });
    setEditingCard(null);
    addToast("Card atualizado!", "success");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold text-white">{deck.name}</h1>
            <Badge label={deck.language} tone="info" />
          </div>
          <p className="text-slate-400">Gerencie cards e ajustes do deck.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" asChild>
            <Link to={`/study/${deck.id}`}>Iniciar estudo</Link>
          </Button>
          <Button variant="danger" onClick={() => setConfirmOpen(true)} aria-label="Excluir deck">
            Excluir deck
          </Button>
        </div>
      </div>

      <Panel>
        <form className="grid gap-4 md:grid-cols-3" onSubmit={handleDeckUpdate}>
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-slate-200">Nome</label>
            <Input value={name} onChange={(event) => setName(event.target.value)} required />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-200">Idioma</label>
            <select
              className="w-full rounded-lg border border-panel-border bg-panel-light px-3 py-2 text-sm"
              value={language}
              onChange={(event) => setLanguage(event.target.value as LanguageCode)}
            >
              <option value="EN">Inglês</option>
              <option value="JA">Japonês</option>
              <option value="KO">Coreano</option>
              <option value="ZH">Mandarim</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <label className="text-sm font-semibold text-slate-200">Descrição</label>
            <Textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={2} />
          </div>
          <div className="md:col-span-3 flex justify-end">
            <Button type="submit">Salvar alterações</Button>
          </div>
        </form>
      </Panel>

      <Panel>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Adicionar card</h2>
            <p className="text-sm text-slate-400">Preencha frente, verso e detalhes extras.</p>
          </div>
        </div>
        <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={handleAddCard}>
          <div>
            <label className="text-sm font-semibold">Front</label>
            <Input value={front} onChange={(event) => setFront(event.target.value)} required />
          </div>
          <div>
            <label className="text-sm font-semibold">Back</label>
            <Input value={back} onChange={(event) => setBack(event.target.value)} required />
          </div>
          <div>
            <label className="text-sm font-semibold">Romanização</label>
            <Input value={romanization} onChange={(event) => setRomanization(event.target.value)} />
          </div>
          <div>
            <label className="text-sm font-semibold">Tags (separadas por vírgula)</label>
            <Input value={tags} onChange={(event) => setTags(event.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-semibold">Exemplo</label>
            <Textarea value={example} onChange={(event) => setExample(event.target.value)} rows={2} />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit">Adicionar card</Button>
          </div>
        </form>
      </Panel>

      <Panel>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Cards</h2>
            <p className="text-sm text-slate-400">Pesquise por texto ou filtre por tags.</p>
          </div>
          <div className="flex gap-3">
            <Input
              placeholder="Buscar..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <select
              className="rounded-lg border border-panel-border bg-panel-light px-3 py-2 text-sm"
              value={tagFilter}
              onChange={(event) => setTagFilter(event.target.value)}
            >
              <option value="">Todas as tags</option>
              {availableTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 space-y-4">
          {filteredCards.map((card) => (
            <div
              key={card.id}
              className="rounded-xl border border-panel-border bg-panel-light p-4"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">{card.front}</h3>
                  <p className="text-sm text-slate-300">{card.back}</p>
                  {card.romanization && <p className="text-xs text-slate-400">{card.romanization}</p>}
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setEditingCard(card)}>
                    Editar
                  </Button>
                  <Button variant="danger" onClick={() => deleteCard(card.id)}>
                    Excluir
                  </Button>
                </div>
              </div>
              {card.example && <p className="mt-2 text-sm text-slate-400">{card.example}</p>}
              <div className="mt-3 flex flex-wrap gap-2">
                {card.tags?.map((tag) => <Badge key={tag} label={tag} />)}
              </div>
            </div>
          ))}
          {filteredCards.length === 0 && (
            <p className="text-sm text-slate-400">Nenhum card encontrado.</p>
          )}
        </div>
      </Panel>

      <Modal
        open={confirmOpen}
        title="Excluir deck"
        description="Essa ação remove o deck e todos os cards associados."
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDeleteDeck}
        confirmLabel="Excluir"
      />

      <Modal
        open={Boolean(editingCard)}
        title="Editar card"
        onClose={() => setEditingCard(null)}
        onConfirm={handleEditSave}
        confirmLabel="Salvar"
      >
        {editingCard && (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-semibold">Front</label>
              <Input
                value={editingCard.front}
                onChange={(event) =>
                  setEditingCard({ ...editingCard, front: event.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Back</label>
              <Input
                value={editingCard.back}
                onChange={(event) => setEditingCard({ ...editingCard, back: event.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Romanização</label>
              <Input
                value={editingCard.romanization ?? ""}
                onChange={(event) =>
                  setEditingCard({ ...editingCard, romanization: event.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Tags</label>
              <Input
                value={(editingCard.tags ?? []).join(", ")}
                onChange={(event) =>
                  setEditingCard({
                    ...editingCard,
                    tags: event.target.value
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter(Boolean),
                  })
                }
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Exemplo</label>
              <Textarea
                rows={2}
                value={editingCard.example ?? ""}
                onChange={(event) =>
                  setEditingCard({ ...editingCard, example: event.target.value })
                }
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DeckDetailPage;
