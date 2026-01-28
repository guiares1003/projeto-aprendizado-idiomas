import { useRef, useState } from "react";
import Panel from "../../components/Panel";
import Button from "../../components/Button";
import { Input } from "../../components/Input";
import { useAppStore } from "../../store/useAppStore";
import { useToast } from "../../components/ToastProvider";
import { validateState } from "../../lib/schema";
import { AppState } from "../../types";

const SettingsPage = () => {
  const { addToast } = useToast();
  const settings = useAppStore((state) => state.settings);
  const setDailyGoal = useAppStore((state) => state.setDailyGoal);
  const importState = useAppStore((state) => state.importState);
  const exportState = useAppStore((state) => ({
    version: state.version,
    decks: state.decks,
    cards: state.cards,
    settings: state.settings,
    dailyLogs: state.dailyLogs,
  }));
  const fileRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"merge" | "replace">("merge");

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(exportState, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `polytrack-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    addToast("Export concluído!", "success");
  };

  const handleImport = async (file: File) => {
    const text = await file.text();
    let parsed: AppState;
    try {
      parsed = JSON.parse(text);
    } catch {
      addToast("JSON inválido.", "error");
      return;
    }
    const validation = validateState(parsed);
    if (!validation.valid) {
      addToast(validation.errors.join(" "), "error");
      return;
    }
    importState(parsed, mode);
    addToast("Importação concluída!", "success");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-white">Settings</h1>
        <p className="text-slate-400">Configure metas e gerencie seus dados.</p>
      </div>

      <Panel>
        <h2 className="text-xl font-semibold">Meta diária</h2>
        <p className="text-sm text-slate-400">Defina quantos cards revisar por dia.</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            type="number"
            value={settings.dailyGoal}
            min={1}
            onChange={(event) => setDailyGoal(Number(event.target.value))}
          />
          <Button variant="secondary" onClick={() => addToast("Meta atualizada!", "success")}>
            Salvar
          </Button>
        </div>
      </Panel>

      <Panel>
        <h2 className="text-xl font-semibold">Importar / Exportar</h2>
        <p className="text-sm text-slate-400">Salve seus decks em JSON ou restaure dados.</p>
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" onClick={handleExport}>
              Exportar JSON
            </Button>
            <Button variant="secondary" onClick={() => fileRef.current?.click()}>
              Importar JSON
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  handleImport(file);
                }
              }}
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Modo de importação</label>
            <select
              className="mt-2 w-full rounded-lg border border-panel-border bg-panel-light px-3 py-2 text-sm"
              value={mode}
              onChange={(event) => setMode(event.target.value as "merge" | "replace")}
            >
              <option value="merge">Mesclar com dados atuais</option>
              <option value="replace">Substituir tudo</option>
            </select>
          </div>
        </div>
      </Panel>
    </div>
  );
};

export default SettingsPage;
