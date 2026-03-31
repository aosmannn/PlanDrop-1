import {
  Clock03Icon,
  Globe02Icon,
  Link01Icon,
  Location01Icon,
  SecurityCheckIcon,
  ZapIcon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { HugeIcon } from "@/components/ui/huge-icon";

const detailBlocks: {
  title: string;
  icon: typeof Location01Icon;
  paragraphs: string[];
  bullets?: string[];
}[] = [
  {
    title: "What PlanDrop is",
    icon: Globe02Icon,
    paragraphs: [
      "PlanDrop is a live board of real outings—venues, meet times, and vibes—so your group can pick something concrete in minutes instead of debating in the chat for an hour.",
      "No account needed. Your picks are saved on this device, and claims are live so two groups can’t lock the same drop at the same time.",
    ],
    bullets: [
      "Homepage: famous places worldwide (curated photos, no AI wait).",
      "Search your city on Browse: we generate fresh plans for that area (short load).",
      "Each AI plan gets a pool timer; unclaimed plans eventually rotate out.",
    ],
  },
  {
    title: "Discover — set your area and browse",
    icon: Location01Icon,
    paragraphs: [
      "On the home hero, use the location search to set where you are planning from—city, neighborhood, or ZIP—or use the optional /drop flow for a precise GPS pin. You can also open Browse plans directly and enter an area there. The pin or text only biases search and AI generation; we are not building a social profile on you.",
      "The grid shows cards with photos, vibe tags, duration, group size, and meet details. Filters let you narrow to chill, active, foodie, adventurous, or headcount. Plans someone else claimed disappear from the board for everyone, but the pool timer keeps running; if they release, the plan can surface again with the same countdown.",
    ],
    bullets: [
      "Open a card for the full gallery, map preview, and hours when we have them from Google Places.",
      "AI-generated cards merge Google photos with fallbacks so images still show if a place has no public photos.",
    ],
  },
  {
    title: "Claim — make it yours",
    icon: ZapIcon,
    paragraphs: [
      "The claim page is your last look: same photos and map as the card, plus price context and bullet list of what to expect at the stop.",
      "When you claim, the plan is locked for your group so it disappears from the live board for everyone else.",
      "Releasing too many times in a row triggers a short cool-down—this nudges people toward real plans instead of endlessly scouting venues.",
    ],
  },
  {
    title: "Brief — share and go",
    icon: Link01Icon,
    paragraphs: [
      "After you claim, you land on the crew briefing. Copy the link into your group chat so everyone has the plan in one place.",
      "Anyone with the link can read the briefing. Only one group can hold the claim at a time—first claim wins.",
    ],
  },
  {
    title: "Your Claims hub",
    icon: SecurityCheckIcon,
    paragraphs: [
      "Use the header button Your Claims to see your active itinerary, pool timer (when applicable), past releases, and a small dashboard with map preview.",
      "Past entries are snapshots from when you released—handy if you want to remember where you almost went.",
    ],
  },
  {
    title: "Timers, fairness, and limits",
    icon: Clock03Icon,
    paragraphs: [
      "Pool expiry is computed from duration, how rich the plan is, and vibe—longer nights get a bit more time in the pool.",
      "Static homepage catalog plans do not use the same pool mechanic; they are always there as inspiration until claimed.",
    ],
  },
];

export function HowItWorksPageDetail() {
  return (
    <div className="bg-white px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-zinc-900 sm:text-3xl">
          The full picture
        </h2>
        <p className="mt-4 text-base leading-relaxed text-zinc-600">
          Below is a deeper walkthrough of each part of the product—how your group
          gets from search to a single locked plan.
        </p>

        <ol className="mt-12 space-y-14">
          {detailBlocks.map((block, i) => (
            <li key={block.title}>
              <div className="flex gap-4">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand ring-1 ring-brand/15"
                  aria-hidden
                >
                  <HugeIcon icon={block.icon} size={22} strokeWidth={1.5} />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-lg font-bold text-zinc-900 sm:text-xl">
                    <span className="mr-2 font-mono text-sm font-semibold tabular-nums text-brand">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {block.title}
                  </h3>
                  <div className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-600 sm:text-[15px]">
                    {block.paragraphs.map((p, pi) => (
                      <p key={`${block.title}-${pi}`}>{p}</p>
                    ))}
                  </div>
                  {block.bullets ? (
                    <ul className="mt-4 list-none space-y-2 border-l-2 border-brand/25 pl-4 text-sm text-zinc-600">
                      {block.bullets.map((b) => (
                        <li
                          key={b}
                          className="relative pl-3 before:absolute before:left-0 before:top-[0.55em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-brand"
                        >
                          {b}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-16 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-6 sm:p-8">
          <p className="text-sm font-bold uppercase tracking-widest text-brand">
            Ready to try it
          </p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600">
            Start from the hero search, or jump straight to browse if you already know
            your city.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/drop"
              className="inline-flex rounded-full bg-brand px-6 py-3 text-sm font-bold text-white shadow-md shadow-brand/20 transition hover:bg-brand-hover"
            >
              Drop a pin
            </Link>
            <Link
              href="/plans"
              className="inline-flex rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50"
            >
              Browse plans
            </Link>
            <Link
              href="/claims"
              className="inline-flex rounded-full border border-transparent px-6 py-3 text-sm font-semibold text-brand underline decoration-brand/30 underline-offset-4"
            >
              Your claims
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
