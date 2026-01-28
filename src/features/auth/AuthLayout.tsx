import { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-100">
    <div className="w-full max-w-md rounded-2xl border border-panel-border bg-panel p-8 shadow-xl">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-white">PolyTrack</h1>
        <p className="text-sm text-slate-400">Acompanhe seus estudos com segurança local.</p>
      </div>
      {children}
    </div>
  </div>
);

export default AuthLayout;
