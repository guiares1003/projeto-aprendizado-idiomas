import { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-slate-900">
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-slate-900">PolyTrack</h1>
        <p className="text-sm text-slate-500">Acompanhe seus estudos com segurança local.</p>
      </div>
      {children}
    </div>
  </div>
);

export default AuthLayout;
