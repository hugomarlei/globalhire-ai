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

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("glass rounded-lg p-5 shadow-soft transition duration-200", className)}>{children}</div>;
}

export function Field({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid min-w-0 gap-2 text-sm font-medium text-white/80">
      <span>{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "focus-ring min-h-11 w-full min-w-0 rounded-md border border-white/10 bg-white/7 px-3 py-2 text-sm text-white placeholder:text-white/35 transition hover:border-white/18";

export const textareaClass =
  "focus-ring min-h-40 w-full min-w-0 rounded-md border border-white/10 bg-white/7 px-3 py-2 text-sm leading-6 text-white placeholder:text-white/35 transition hover:border-white/18";
