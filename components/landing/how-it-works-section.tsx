import {
  GridViewIcon,
  Location01Icon,
  PartyIcon,
  ZapIcon,
} from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/ui/huge-icon";

const steps = [
  {
    icon: Location01Icon,
    title: "Drop a pin",
    body: "Enter your city or neighborhood. We surface plans designed for your exact area.",
  },
  {
    icon: GridViewIcon,
    title: "Browse the drop",
    body: "See the live grid of available plans — each with a vibe, duration, group size, and stops.",
  },
  {
    icon: ZapIcon,
    title: "Lock it in",
    body: "Review the plan and tap Claim—your group gets a live hold, so no one double-books the same slot.",
  },
  {
    icon: PartyIcon,
    title: "Just show up",
    body: "Share a link with your crew. They see venues, timing, and what to expect. Then just go.",
  },
] as const;

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 bg-zinc-50 px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
    >
      <div className="mx-auto max-w-7xl text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-brand">
          How PlanDrop works
        </p>
        <h2 className="font-display mt-4 text-3xl font-bold leading-snug tracking-[-0.02em] text-zinc-900 sm:text-4xl">
          Four steps. Zero debates.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-zinc-600 sm:text-lg">
          We did the planning so you don&apos;t have to argue for 40 minutes
          about where to eat.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <div
            key={s.title}
            className="group relative overflow-hidden rounded-3xl bg-white p-8 text-left shadow-sm ring-1 ring-zinc-100 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/5 hover:ring-brand/20"
          >
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-brand-soft opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand shadow-sm ring-1 ring-brand/10">
                <HugeIcon icon={s.icon} size={22} strokeWidth={1.5} />
              </div>
              <div className="mt-6">
                <h3 className="font-display flex items-center gap-3 text-lg font-semibold leading-snug text-zinc-900">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold tabular-nums text-zinc-500">
                    {i + 1}
                  </span>
                  {s.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                  {s.body}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
