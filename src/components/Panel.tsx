import { ReactNode } from "react";
import clsx from "clsx";

type PanelProps = {
  children: ReactNode;
  className?: string;
};

const Panel = ({ children, className }: PanelProps) => (
  <div className={clsx("rounded-2xl border border-slate-200 bg-white p-6 shadow-sm", className)}>
    {children}
  </div>
);

export default Panel;
