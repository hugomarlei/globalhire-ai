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
        "inline-flex shrink-0 rounded-xl border border-border bg-muted/70 p-0.5 shadow-sm backdrop-blur-sm",
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
            "focus-ring inline-flex size-9 items-center justify-center rounded-lg transition",
            preference === value
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
