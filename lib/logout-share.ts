/** Canonical site URL for post-logout sharing (marketing). */
export const LOGOUT_SHARE_SITE_URL = "https://www.globalhireai.com.br";

export const LOGOUT_SHARE_WHATSAPP_TEXT =
  "Conheci a GlobalHire AI e achei a proposta muito interessante para quem está buscando oportunidades melhores. A plataforma ajuda a criar currículos otimizados para ATS, cartas de apresentação e documentos de carreira usando IA. Vale conhecer: https://www.globalhireai.com.br";

export const LOGOUT_SHARE_COPY_TEXT = `Conheci a GlobalHire AI e achei a proposta muito interessante para quem está buscando oportunidades melhores.

A plataforma ajuda a criar currículos otimizados para ATS, cartas de apresentação e documentos de carreira usando IA, com foco em candidaturas mais organizadas e profissionais.

Para quem está tentando se recolocar, melhorar o currículo ou se candidatar para vagas internacionais, vale conhecer:

https://www.globalhireai.com.br`;

export function getLinkedInShareUrl() {
  const url = encodeURIComponent(LOGOUT_SHARE_SITE_URL);
  return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
}

export function getWhatsAppShareUrl() {
  return `https://wa.me/?text=${encodeURIComponent(LOGOUT_SHARE_WHATSAPP_TEXT)}`;
}
