/** Public marketing URLs only (NEXT_PUBLIC_*). Omit link if unset. */
export function getSocialLinks() {
  return {
    linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN_URL?.trim() || "",
    instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL?.trim() || ""
  };
}
