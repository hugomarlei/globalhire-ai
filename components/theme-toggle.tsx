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

export function ThemeToggle({
  labels,
  className,
  palette = "ink"
}: {
  labels: { light: string; dark: string; system: string };
  className?: string;
  palette?: "ink" | "paper";
}) {
  const { preference, setPreference } = useTheme();
  const labelMap: Record<ThemePreference, string> = {
    light: labels.light,
    dark: labels.dark,
    system: labels.system
  };

  const inactive =
    palette === "paper"
      ? "text-graphite/75 hover:bg-graphite/10 hover:text-ink"
      : "text-white/70 hover:bg-white/10 hover:text-white";

  return (
    <div className={cn("inline-flex rounded-md border border-white/10 bg-white/6 p-0.5", className)} role="group" aria-label="Theme">
      {options.map(({ value, Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => setPreference(value)}
          className={cn(
            "focus-ring inline-flex size-9 items-center justify-center rounded-md transition",
            preference === value ? "bg-brand-500 text-ink" : inactive
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
