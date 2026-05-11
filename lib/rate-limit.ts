import { createAdminClient } from "@/lib/supabase-server";

type RateLimitResult = {
  ok: boolean;
  remaining: number;
  resetAt: number;
  source: "supabase" | "memory";
};

const memoryBuckets = new Map<string, { count: number; resetAt: number }>();

function memoryRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const current = memoryBuckets.get(key);

  if (!current || current.resetAt < now) {
    memoryBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, resetAt: now + windowMs, source: "memory" };
  }

  if (current.count >= limit) {
    return { ok: false, remaining: 0, resetAt: current.resetAt, source: "memory" };
  }

  current.count += 1;
  return { ok: true, remaining: limit - current.count, resetAt: current.resetAt, source: "memory" };
}

function canUseSupabaseRateLimit() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function buildRateLimitKey(scope: string, userId: string | null | undefined, ip: string) {
  return `${scope}:${userId || "anonymous"}:${ip || "unknown"}`;
}

export async function rateLimit(key: string, limit = 10, windowMs = 60_000): Promise<RateLimitResult> {
  if (!canUseSupabaseRateLimit()) {
    return memoryRateLimit(key, limit, windowMs);
  }

  const now = Date.now();
  const resetAt = new Date(now + windowMs);

  try {
    const supabase = createAdminClient();
    const { data: current, error: selectError } = await supabase
      .from("rate_limits")
      .select("count,reset_at")
      .eq("key", key)
      .maybeSingle();

    if (selectError) {
      console.warn("rate_limit_select_failed", { code: selectError.code, message: selectError.message });
      return memoryRateLimit(key, limit, windowMs);
    }

    const currentResetAt = current?.reset_at ? new Date(current.reset_at).getTime() : 0;

    if (!current || currentResetAt <= now) {
      const { error: upsertError } = await supabase.from("rate_limits").upsert({
        key,
        count: 1,
        reset_at: resetAt.toISOString(),
        updated_at: new Date(now).toISOString()
      });

      if (upsertError) {
        console.warn("rate_limit_upsert_failed", { code: upsertError.code, message: upsertError.message });
        return memoryRateLimit(key, limit, windowMs);
      }

      return { ok: true, remaining: limit - 1, resetAt: resetAt.getTime(), source: "supabase" };
    }

    if (current.count >= limit) {
      return { ok: false, remaining: 0, resetAt: currentResetAt, source: "supabase" };
    }

    const nextCount = current.count + 1;
    const { error: updateError } = await supabase
      .from("rate_limits")
      .update({ count: nextCount, updated_at: new Date(now).toISOString() })
      .eq("key", key);

    if (updateError) {
      console.warn("rate_limit_update_failed", { code: updateError.code, message: updateError.message });
      return memoryRateLimit(key, limit, windowMs);
    }

    return { ok: true, remaining: limit - nextCount, resetAt: currentResetAt, source: "supabase" };
  } catch (error) {
    console.warn("rate_limit_storage_unavailable", error);
    return memoryRateLimit(key, limit, windowMs);
  }
}

export async function cooldownLimit(key: string, windowMs = 30_000) {
  return rateLimit(key, 1, windowMs);
}
