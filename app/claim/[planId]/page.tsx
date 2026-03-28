import type { Metadata } from "next";
import { Suspense } from "react";
import { ClaimPlanClient } from "./claim-client";
import { getPlanById } from "@/lib/plans-data";

type Props = {
  params: Promise<{ planId: string }>;
  searchParams: Promise<{ area?: string; snapshot?: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ planId: string }>;
}): Promise<Metadata> {
  const { planId } = await params;
  const plan = getPlanById(planId);
  if (!plan) return { title: "Claim plan — PlanDrop" };
  return {
    title: `Claim ${plan.title} — PlanDrop`,
    description: `Lock "${plan.title}" for your group before someone else does.`,
  };
}

export default async function ClaimPlanPage({ params, searchParams }: Props) {
  const { planId } = await params;
  const { area: areaFromQuery, snapshot: snapshotFromQuery } = await searchParams;
  const staticPlan = getPlanById(planId);

  return (
    <Suspense fallback={null}>
      <ClaimPlanClient
        planId={planId}
        staticPlan={staticPlan ?? null}
        areaFromQuery={areaFromQuery ?? null}
        snapshotFromQuery={snapshotFromQuery ?? null}
      />
    </Suspense>
  );
}
