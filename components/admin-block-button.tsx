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
      className="focus-ring rounded-md border border-border px-3 py-2 text-sm text-foreground hover:bg-muted disabled:opacity-50"
    >
      {blocked ? "Desbloquear" : "Bloquear"}
    </button>
  );
}
