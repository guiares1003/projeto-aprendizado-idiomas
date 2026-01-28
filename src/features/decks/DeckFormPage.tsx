import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Panel from "../../components/Panel";
import { Input, Textarea } from "../../components/Input";
import { useAppStore } from "../../store/useAppStore";
import { LanguageCode } from "../../types";
import { useToast } from "../../components/ToastProvider";

const DeckFormPage = () => {
  const navigate = useNavigate();
  const addDeck = useAppStore((state) => state.addDeck);
  const { addToast } = useToast();
  const [name, setName] = useState("");
  const [language, setLanguage] = useState<LanguageCode>("EN");
  const [description, setDescription] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    const deck = addDeck({ name: name.trim(), language, description: description.trim() || undefined });
    addToast("Deck criado com sucesso!", "success");
    navigate(`/decks/${deck.id}`);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">Novo deck</h1>
        <p className="text-slate-400">Crie um deck para organizar seus cartões.</p>
      </div>

      <Panel>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-semibold text-slate-200">Nome do deck</label>
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
          <div>
            <label className="text-sm font-semibold text-slate-200">Descrição</label>
            <Textarea
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit">Salvar deck</Button>
          </div>
        </form>
      </Panel>
    </div>
  );
};

export default DeckFormPage;
