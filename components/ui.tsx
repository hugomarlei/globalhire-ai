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
    "focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-glow transition duration-200 hover:brightness-[1.05] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:brightness-100 dark:shadow-glow-dark",
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
  "rounded-2xl border border-border/90 bg-card/85 p-5 text-card-foreground shadow-soft backdrop-blur-xl transition duration-200 dark:border-border/80 dark:bg-card/75 dark:shadow-[0_24px_80px_rgba(0,0,0,0.35)]";

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
    <label className="grid min-w-0 gap-2 text-sm font-medium text-foreground/90">
      <span>{label}</span>
      {children}
    </label>
  );
}

/** Inputs: sempre par surface/border/foreground definido em tokens (:root / dark). */
export const inputClass = cn(
  "focus-ring min-h-11 w-full min-w-0 rounded-xl border border-input bg-card/90 px-3 py-2 text-sm text-card-foreground shadow-inner caret-foreground backdrop-blur-sm transition",
  "placeholder:text-muted-foreground",
  "hover:border-border",
  "selection:bg-primary/15 selection:text-foreground",
  "disabled:cursor-not-allowed disabled:border-border/60 disabled:bg-muted disabled:text-muted-foreground",
  "[&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgb(var(--card))] [&:-webkit-autofill]:[-webkit-text-fill-color:rgb(var(--card-foreground))]"
);

export const textareaClass = cn(
  inputClass,
  "min-h-40 leading-6"
);
