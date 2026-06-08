/**
 * Server-side admin allowlist for `/admin` and `/api/admin/*`.
 *
 * - Source of truth: `ADMIN_EMAILS` (comma-separated, case-insensitive).
 * - Empty or missing env → no one passes admin checks (fail closed).
 * - Does not use `profiles.is_admin`, so DB flags cannot accidentally grant admin routes.
 */

export function getAdminEmailAllowlist(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter((item) => item.length > 0 && item.includes("@"));
}

export function isAllowedAdminEmail(email: string | null | undefined): boolean {
  const allow = getAdminEmailAllowlist();
  if (allow.length === 0) return false;
  const normalized = (email ?? "").trim().toLowerCase();
  return normalized.length > 0 && allow.includes(normalized);
}
