"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { SetupFlowStepper } from "@/components/setup-flow-stepper";
import { clearSkipDropFromLocation } from "@/lib/claim-storage";

export function PlansPageStepper() {
  const searchParams = useSearchParams();
  const area = searchParams.get("area");

  useEffect(() => {
    clearSkipDropFromLocation();
  }, []);

  return <SetupFlowStepper phase="discover" areaHint={area} />;
}
