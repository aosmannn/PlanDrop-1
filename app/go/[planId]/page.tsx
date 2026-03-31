import type { Metadata } from "next";
import { GoPlanClient } from "./go-plan-client";
import { getPlanById } from "@/lib/plans-data";

type Props = {
  params: Promise<{ planId: string }>;
  searchParams: Promise<{
    area?: string;
    snapshot?: string;
    z?: string;
    ck?: string;
  }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ planId: string }>;
}): Promise<Metadata> {
  const { planId } = await params;
  const plan = getPlanById(planId);
  if (!plan) return { title: "Plan — PlanDrop" };
  return {
    title: `${plan.title} — Crew briefing`,
    description: plan.tagline,
  };
}

export default async function GoPlanPage({ params, searchParams }: Props) {
  const { planId } = await params;
  const {
    area: areaFromQuery,
    snapshot: snapshotFromQuery,
    z: zFromQuery,
    ck: ckFromQuery,
  } = await searchParams;
  const staticPlan = getPlanById(planId);

  return (
    <GoPlanClient
      planId={planId}
      staticPlan={staticPlan ?? null}
      areaHint={areaFromQuery ?? null}
      snapshotFromQuery={snapshotFromQuery ?? null}
      zFromQuery={zFromQuery ?? null}
      ckFromQuery={ckFromQuery?.trim() || null}
    />
  );
}
