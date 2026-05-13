/** Official profiles (defaults). Env vars override when set (ops / white-label). */
const DEFAULT_LINKEDIN = "https://www.linkedin.com/company/121864045";
const DEFAULT_INSTAGRAM = "https://www.instagram.com/globalhireai";
const DEFAULT_TIKTOK = "https://www.tiktok.com/@globalhireai";

function pick(env: string | undefined, fallback: string) {
  const v = env?.trim();
  return v && v.startsWith("http") ? v : fallback;
}

export function getSocialLinks() {
  return {
    linkedin: pick(process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN_URL, DEFAULT_LINKEDIN),
    instagram: pick(process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL, DEFAULT_INSTAGRAM),
    tiktok: pick(process.env.NEXT_PUBLIC_SOCIAL_TIKTOK_URL, DEFAULT_TIKTOK)
  };
}
