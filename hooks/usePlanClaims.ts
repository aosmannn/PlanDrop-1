"use client";
import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

export function usePlanClaims(): Set<string> {
  const [claimed, setClaimed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const supabase = getSupabaseBrowser();

    supabase
      .from("plan_claims")
      .select("plan_id")
      .then(({ data }) => {
        if (data) setClaimed(new Set(data.map((r) => r.plan_id)));
      });

    const channel = supabase
      .channel("plan-claims-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "plan_claims" },
        (payload) => {
          setClaimed((prev) => {
            const next = new Set(prev);
            next.add(payload.new.plan_id as string);
            return next;
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "plan_claims" },
        (payload) => {
          setClaimed((prev) => {
            const next = new Set(prev);
            next.delete(payload.old.plan_id as string);
            return next;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return claimed;
}