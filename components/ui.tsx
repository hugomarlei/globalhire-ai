import Link from "next/link";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: Array<string | false | null | undefined>) {
  return twMerge(clsx(inputs));
}

export function Button({
  children,
  className,
  href,
  type = "button",
  onClick,
  disabled
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
  type?: "button" | "submit";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}) {
  const classes = cn(
    "focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 text-sm font-semibold text-ink shadow-glow transition duration-200 hover:bg-brand-200 hover:brightness-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:brightness-100",
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

const cardSurface =
  "rounded-xl border p-5 shadow-soft transition duration-200 border-graphite/12 bg-white text-ink shadow-[0_16px_48px_rgba(0,0,0,0.06)] backdrop-blur-md dark:border-white/[0.09] dark:bg-graphite/92 dark:text-white dark:shadow-[0_20px_50px_rgba(0,0,0,0.28)] dark:backdrop-blur-md";

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn(cardSurface, className)}>{children}</div>;
}

export function Field({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid min-w-0 gap-2 text-sm font-medium text-graphite/85 dark:text-white/80">
      <span>{label}</span>
      {children}
    </label>
  );
}

/** Inputs and selects: readable on light surfaces (marketing/legal light) and on dark app shell. */
export const inputClass = cn(
  "focus-ring min-h-11 w-full min-w-0 rounded-xl border px-3 py-2 text-sm transition",
  "border-graphite/25 bg-white text-ink shadow-inner caret-ink placeholder:text-graphite/50",
  "hover:border-graphite/40",
  "selection:bg-brand-100 selection:text-ink",
  "disabled:cursor-not-allowed disabled:border-graphite/15 disabled:bg-graphite/[0.06] disabled:text-graphite/45",
  "dark:border-white/12 dark:bg-[#1a222d] dark:text-white dark:caret-white dark:shadow-none dark:placeholder:text-white/45 dark:hover:border-white/20",
  "dark:selection:bg-brand-700/45 dark:selection:text-white",
  "dark:disabled:border-white/8 dark:disabled:bg-white/[0.06] dark:disabled:text-white/35",
  "[&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgb(255_255_255)] [&:-webkit-autofill]:[-webkit-text-fill-color:#06120F]",
  "dark:[&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgb(26_34_45)] dark:[&:-webkit-autofill]:[-webkit-text-fill-color:#f7f8fa]"
);

export const textareaClass = cn(
  inputClass,
  "min-h-40 leading-6"
);
