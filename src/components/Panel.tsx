import { ReactNode } from "react";
import clsx from "clsx";

type PanelProps = {
  children: ReactNode;
  className?: string;
};

const Panel = ({ children, className }: PanelProps) => (
  <div className={clsx("rounded-2xl border border-panel-border bg-panel p-6 shadow-lg", className)}>
    {children}
  </div>
);

export default Panel;
