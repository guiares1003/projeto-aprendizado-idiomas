import { ReactNode } from "react";
import { NavigationLinks } from "./Navigation";
import { useAppStore } from "../store/useAppStore";
import Button from "./Button";

const Layout = ({ children }: { children: ReactNode }) => {
  const activeUser = useAppStore((state) => state.activeUser);
  const logout = useAppStore((state) => state.logout);
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-7xl">
        <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r border-panel-border bg-panel px-6 py-8 lg:flex">
          <div className="text-2xl font-bold text-white">PolyTrack</div>
          <p className="mt-2 text-sm text-slate-400">Seu painel de revisão espaçada.</p>
          <div className="mt-6 rounded-xl border border-panel-border bg-panel-light p-4 text-sm">
            <p className="text-slate-400">Conectado como</p>
            <p className="font-semibold text-white">{activeUser?.name}</p>
            <p className="text-xs text-slate-500">{activeUser?.email}</p>
            <Button variant="ghost" className="mt-3 w-full" onClick={logout} aria-label="Sair">
              Sair
            </Button>
          </div>
          <div className="mt-8">
            <NavigationLinks orientation="vertical" />
          </div>
        </aside>
        <main className="flex-1 px-4 pb-24 pt-8 lg:px-10">
          <header className="mb-8 flex flex-col gap-2 lg:hidden">
            <div className="text-2xl font-bold text-white">PolyTrack</div>
            <p className="text-sm text-slate-400">Seu painel de revisão espaçada.</p>
            <div className="mt-2 rounded-xl border border-panel-border bg-panel-light p-3 text-sm">
              <p className="text-slate-400">Conectado como</p>
              <p className="font-semibold text-white">{activeUser?.name}</p>
              <Button
                variant="ghost"
                className="mt-2 w-full justify-center"
                onClick={logout}
                aria-label="Sair"
              >
                Sair
              </Button>
            </div>
          </header>
          {children}
        </main>
      </div>
      <div className="fixed bottom-0 left-0 right-0 border-t border-panel-border bg-panel/95 px-2 py-3 backdrop-blur lg:hidden">
        <NavigationLinks orientation="horizontal" />
      </div>
    </div>
  );
};

export default Layout;
