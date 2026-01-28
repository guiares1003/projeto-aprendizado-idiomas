import { Link } from "react-router-dom";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Panel from "../../components/Panel";
import Button from "../../components/Button";
import { useAppStore } from "../../store/useAppStore";
import { addDays, formatDateKey, isDue, startOfDay } from "../../lib/date";

const DashboardPage = () => {
  const decks = useAppStore((state) => state.decks);
  const cards = useAppStore((state) => state.cards);
  const dailyLogs = useAppStore((state) => state.dailyLogs);
  const settings = useAppStore((state) => state.settings);

  const dueToday = cards.filter((card) => isDue(card.stats.dueDate)).length;
  const todayKey = formatDateKey(new Date());
  const todayLog = dailyLogs.find((log) => log.date === todayKey);
  const reviewsToday = todayLog?.totalReviews ?? 0;

  const logMap = new Map(dailyLogs.map((log) => [log.date, log]));
  const chartData = Array.from({ length: 14 }).map((_, index) => {
    const date = addDays(startOfDay(new Date()), -13 + index);
    const key = formatDateKey(date);
    return {
      date: key.slice(5),
      reviews: logMap.get(key)?.totalReviews ?? 0,
    };
  });

  const streak = (() => {
    let count = 0;
    let cursor = startOfDay(new Date());
    while (true) {
      const key = formatDateKey(cursor);
      const log = logMap.get(key);
      if (!log || log.totalReviews < settings.dailyGoal) break;
      count += 1;
      cursor = addDays(cursor, -1);
    }
    return count;
  })();

  const topDecks = (() => {
    const last7 = Array.from({ length: 7 }).map((_, index) => {
      const date = addDays(startOfDay(new Date()), -index);
      return formatDateKey(date);
    });
    const totals = new Map<string, number>();
    last7.forEach((key) => {
      const log = logMap.get(key);
      if (!log) return;
      Object.entries(log.byDeck).forEach(([deckId, count]) => {
        totals.set(deckId, (totals.get(deckId) ?? 0) + count);
      });
    });
    return decks
      .map((deck) => ({ deck, count: totals.get(deck.id) ?? 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  })();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
          <p className="text-slate-400">Seu progresso diário em PolyTrack.</p>
        </div>
        <Button variant="primary" asChild>
          <Link to="/study">Iniciar estudo</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Panel>
          <p className="text-sm text-slate-400">Total de decks</p>
          <p className="mt-2 text-3xl font-semibold text-white">{decks.length}</p>
        </Panel>
        <Panel>
          <p className="text-sm text-slate-400">Vencidos hoje</p>
          <p className="mt-2 text-3xl font-semibold text-white">{dueToday}</p>
        </Panel>
        <Panel>
          <p className="text-sm text-slate-400">Reviews hoje</p>
          <p className="mt-2 text-3xl font-semibold text-white">{reviewsToday}</p>
        </Panel>
        <Panel>
          <p className="text-sm text-slate-400">Streak</p>
          <p className="mt-2 text-3xl font-semibold text-white">{streak} dias</p>
        </Panel>
      </div>

      <Panel>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Reviews últimos 14 dias</h2>
            <p className="text-sm text-slate-400">Meta diária: {settings.dailyGoal} cards</p>
          </div>
        </div>
        <div className="mt-6 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: "#111827",
                  border: "1px solid #374151",
                  borderRadius: 12,
                }}
              />
              <Line type="monotone" dataKey="reviews" stroke="#6366f1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <Panel>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Top decks (7 dias)</h2>
            <p className="text-sm text-slate-400">Decks mais revisados recentemente.</p>
          </div>
          <Button variant="secondary" asChild>
            <Link to="/decks">Ver decks</Link>
          </Button>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {topDecks.map(({ deck, count }) => (
            <div key={deck.id} className="rounded-xl border border-panel-border bg-panel-light p-4">
              <h3 className="text-lg font-semibold text-white">{deck.name}</h3>
              <p className="text-sm text-slate-400">{count} reviews</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
};

export default DashboardPage;
