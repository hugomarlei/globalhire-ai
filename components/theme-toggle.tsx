"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import type { ThemePreference } from "@/lib/theme";
import { cn } from "@/components/ui";

const options: Array<{ value: ThemePreference; Icon: typeof Sun }> = [
  { value: "light", Icon: Sun },
  { value: "dark", Icon: Moon },
  { value: "system", Icon: Monitor }
];

export function ThemeToggle({ labels, className }: { labels: { light: string; dark: string; system: string }; className?: string }) {
  const { preference, setPreference } = useTheme();
  const labelMap: Record<ThemePreference, string> = {
    light: labels.light,
    dark: labels.dark,
    system: labels.system
  };

  return (
    <div
      className={cn(
        "inline-flex shrink-0 rounded-md border p-0.5",
        "border-graphite/20 bg-white/90 dark:border-white/10 dark:bg-white/6",
        className
      )}
      role="group"
      aria-label="Theme"
    >
      {options.map(({ value, Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => setPreference(value)}
          className={cn(
            "focus-ring inline-flex size-9 items-center justify-center rounded-md transition",
            preference === value
              ? "bg-brand-500 text-ink"
              : "text-graphite/70 hover:bg-graphite/10 hover:text-ink dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
          )}
          title={labelMap[value]}
          aria-pressed={preference === value}
          aria-label={labelMap[value]}
        >
          <Icon size={17} />
        </button>
      ))}
    </div>
  );
}
