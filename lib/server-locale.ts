import { cookies } from "next/headers";
import { isLocale, type Locale } from "@/lib/i18n";

export async function getServerLocale(): Promise<Locale> {
  const raw = (await cookies()).get("globalhire-locale")?.value;
  return isLocale(raw) ? raw : "pt-BR";
}
