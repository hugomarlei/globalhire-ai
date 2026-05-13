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
    "focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-md bg-brand-500 px-5 text-sm font-semibold text-ink shadow-glow transition hover:-translate-y-0.5 hover:bg-brand-200 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60",
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
  "rounded-lg border p-5 shadow-soft transition duration-200 border-graphite/15 bg-white/95 text-ink shadow-[0_24px_80px_rgba(0,0,0,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-graphite/90 dark:text-white dark:shadow-soft dark:backdrop-blur-xl";

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
  "focus-ring min-h-11 w-full min-w-0 rounded-md border px-3 py-2 text-sm transition",
  "border-graphite/25 bg-white text-ink shadow-inner placeholder:text-graphite/45",
  "hover:border-graphite/40",
  "dark:border-white/10 dark:bg-white/7 dark:text-white dark:shadow-none dark:placeholder:text-white/35 dark:hover:border-white/20",
  "[&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgb(255_255_255)] [&:-webkit-autofill]:[-webkit-text-fill-color:#070A0D]",
  "dark:[&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgb(28_36_44)] dark:[&:-webkit-autofill]:[-webkit-text-fill-color:#f7f8fa]"
);

export const textareaClass = cn(
  inputClass,
  "min-h-40 leading-6"
);
