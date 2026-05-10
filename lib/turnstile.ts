export async function verifyTurnstileToken(token?: string | null, ip?: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("turnstile_skipped_missing_secret");
      return { ok: true, skipped: true };
    }

    return { ok: false, error: "Captcha não configurado no servidor." };
  }

  if (!token) return { ok: false, error: "Confirme o captcha para continuar." };

  const formData = new FormData();
  formData.append("secret", secret);
  formData.append("response", token);
  if (ip) formData.append("remoteip", ip);

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData
    });
    const data = await response.json() as { success?: boolean; "error-codes"?: string[] };

    if (!data.success) {
      console.warn("turnstile_failed", data["error-codes"]);
      return { ok: false, error: "Captcha inválido. Atualize a página e tente novamente." };
    }

    return { ok: true };
  } catch (error) {
    console.error("turnstile_verify_error", error);
    return { ok: false, error: "Não consegui validar o captcha agora. Tente novamente." };
  }
}
