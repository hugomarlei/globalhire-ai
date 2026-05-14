import type { Locale } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n";

const cookieName = "globalhire-locale";

export function readLocaleFromDocumentCookie(): Locale {
  if (typeof document === "undefined") return "pt-BR";
  const raw = document.cookie.split("; ").find((row) => row.startsWith(`${cookieName}=`));
  if (!raw) return "pt-BR";
  const value = decodeURIComponent(raw.split("=").slice(1).join("="));
  return isLocale(value) ? value : "pt-BR";
}

export const globalErrorCopy: Record<Locale, { title: string; body: string; home: string }> = {
  "pt-BR": {
    title: "Algo saiu errado",
    body: "Tente atualizar a página. Se o problema continuar, volte ao início e entre em contato com o suporte.",
    home: "Ir ao início"
  },
  en: {
    title: "Something went wrong",
    body: "Try refreshing the page. If it keeps happening, go home and contact support.",
    home: "Go to home"
  },
  es: {
    title: "Algo salió mal",
    body: "Intenta actualizar la página. Si continúa, vuelve al inicio y contacta soporte.",
    home: "Ir al inicio"
  },
  fr: {
    title: "Une erreur s’est produite",
    body: "Actualisez la page. Si le problème persiste, retournez à l’accueil et contactez le support.",
    home: "Aller à l’accueil"
  }
};
