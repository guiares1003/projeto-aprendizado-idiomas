import clsx from "clsx";

type ProgressProps = {
  value: number;
  max: number;
  className?: string;
};

const Progress = ({ value, max, className }: ProgressProps) => {
  const percent = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className={clsx("h-2 w-full rounded-full bg-slate-800", className)}>
      <div className="h-2 rounded-full bg-brand" style={{ width: `${percent}%` }} />
    </div>
  );
};

export default Progress;
