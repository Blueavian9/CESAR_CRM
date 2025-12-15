import type { FC } from "react";

type Props = {
  label: string;
  variant?: "green" | "amber" | "sky" | "rose" | "slate";
};

const VARIANT: Record<NonNullable<Props["variant"]>, string> = {
  green: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  amber: "bg-amber-50 text-amber-700 border border-amber-100",
  sky: "bg-sky-50 text-sky-700 border border-sky-100",
  rose: "bg-rose-50 text-rose-700 border border-rose-100",
  slate: "bg-slate-100 text-slate-600 border border-slate-200",
};

const StatusBadge: FC<Props> = ({ label, variant = "slate" }) => {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        VARIANT[variant],
      ].join(" ")}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
