"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

const TAB_KEY = "plandrop_presence_tab_id";

function presenceKeyForTab(): string {
  if (typeof window === "undefined") return "ssr";
  try {
    let id = sessionStorage.getItem(TAB_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `t-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem(TAB_KEY, id);
    }
    return id;
  } catch {
    return `t-${Math.random().toString(36).slice(2)}`;
  }
}

/**
 * Live count of other clients currently “viewing” this plan via Supabase Presence.
 */
export function usePlanPresenceCount(
  planId: string,
  enabled: boolean,
): number | null {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!enabled || !planId.trim()) {
      setCount(null);
      return;
    }

    let cancelled = false;
    const supabase = getSupabaseBrowser();
    const channelName = `plan-presence:${planId.trim()}`;
    const presenceKey = presenceKeyForTab();

    const channel = supabase.channel(channelName, {
      config: { presence: { key: presenceKey } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        if (cancelled) return;
        const state = channel.presenceState();
        setCount(Object.keys(state).length);
      })
      .subscribe(async (status) => {
        if (status !== "SUBSCRIBED" || cancelled) return;
        await channel.track({ planId: planId.trim(), at: Date.now() });
      });

    return () => {
      cancelled = true;
      void supabase.removeChannel(channel);
    };
  }, [planId, enabled]);

  return count;
}
