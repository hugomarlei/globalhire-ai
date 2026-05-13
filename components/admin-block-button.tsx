"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminBlockButton({ userId, blocked }: { userId: string; blocked: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    await fetch("/api/admin/block-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, blocked: !blocked })
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className="focus-ring rounded-md border border-graphite/20 px-3 py-2 text-sm text-graphite/80 hover:bg-graphite/10 disabled:opacity-50 dark:border-white/10 dark:text-white/80 dark:hover:bg-white/10"
    >
      {blocked ? "Desbloquear" : "Bloquear"}
    </button>
  );
}
