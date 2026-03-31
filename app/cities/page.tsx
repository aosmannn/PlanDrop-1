import type { Metadata } from "next";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { CitiesClient } from "./cities-client";

export const metadata: Metadata = {
  title: "Cities — PlanDrop",
  description:
    "PlanDrop is live in Atlanta. Request your city and get notified as we launch new drops.",
};

export default function CitiesPage() {
  return (
    <>
      <SiteHeader />
      <CitiesClient />
      <SiteFooter />
    </>
  );
}

