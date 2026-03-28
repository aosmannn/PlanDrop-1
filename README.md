# PlanDrop

**Friend-group activities, first come first served.** Browse a live pool of AI-curated plans for your area, claim one before someone else does, and share the group link—no blank itinerary, no endless “what do you want to do?”

Built in 12 hours for Hackathon 2026.

---

## What is PlanDrop?

PlanDrop is like **Airbnb Experiences meets a flash sale**. A curated set of plans drops for a given area. Each plan is unique and can only be claimed by **one group**. Once it’s gone, it’s gone.

That scarcity kills decision paralysis: you pick from ready-made options instead of starting from zero.

## The problem

Planning with a group usually looks like this:

- “What do you want to do tonight?”
- “I don’t know, what do you want to do?”
- Half an hour later, pizza wins again.

Blank tools are too much work; generic venue lists aren’t curated for *your* group. PlanDrop offers **ready-to-go plans** and **urgency through scarcity**—not pressure, just a clear pool of options.

## How it works

1. Open PlanDrop and **drop a pin** or enter your area.
2. **Browse** a live grid—each card shows vibe, duration, group size, and key stops.
3. Hit **Claim** on the plan your group wants. It’s **locked to you** immediately.
4. **Share** the group link so friends see the full plan: venues, timing, what to expect at each stop.
5. Go have fun.

If your first choice is taken, the next best plan is right there.

## The claim system

The differentiator is **atomic claiming**: one database transaction checks availability and locks the plan at the same time—**no race conditions, no double-bookings**.

**Supabase Realtime** pushes updates so anyone watching sees a plan flip to “Claimed” instantly—ideal for the demo (two browsers side by side).

Plans that aren’t claimed can be refreshed for the next day so the pool stays fresh.

## What’s in a plan?

Plans are **pre-generated with Claude** (not per-request in the hot path), structured as roughly **2–4 hour** itineraries:

| Element | Example |
|--------|---------|
| Vibe | Chill, Active, Foodie, Adventurous |
| Group size | 2, 4, 6+ |
| Stops | 3–4: venue, what to do, suggested timing |
| Cost | Estimated per person |
| Hook | One-line “why this works” |

## Tech stack

| Layer | Choice |
|--------|--------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| API | Next.js API routes (serverless) |
| Database | Supabase (Postgres + Realtime + RLS) |
| AI | Claude API (`claude-sonnet-4-6`) |
| Deployment | Vercel + Supabase cloud |
| Auth | Supabase anonymous sessions (no login required for MVP) |

## MVP scope

**Must ship**

- Plan browsing grid with **vibe** and **group size** filters
- **Atomic claim** with **real-time** “claimed” state
- **Shareable group URL** with full plan detail
- **20–30** pre-generated plans for **one demo area**

**Nice to have**

- Live “viewing this plan” counter
- Countdown when few plans remain
- Multiple cities/areas

**Out of scope (for now)**

- User accounts / profiles
- Ratings and reviews
- Native mobile app (web-first)
- Payments / bookings

## Team split (4 people)

| Person | Focus |
|--------|--------|
| 1 | Supabase schema, atomic claim function, seed plans (20–30) |
| 2 | Claude integration, prompts, `/api/plans` and `/api/claim` |
| 3 | Browse UI, claim button, Realtime for live badges |
| 4 | Plan detail page, shareable URL, Tailwind polish |

**Integration:** P1 + P2 wire DB ↔ API around **hour 3**. P3 + P4 connect UI to live API once stable; polish and edge cases **hours 6–10**.

## 12-hour timeline (high level)

| Phase | Hours | Goals |
|-------|--------|--------|
| Setup | 0–0.5 | Repo, Supabase, Vercel; everyone cloned |
| Parallel build | 0.5–3 | Schema/seed, Claude + routes, browse scaffold, routing + styling |
| Integration | 3–6 | Wire API to DB; UI to endpoints; fix contract mismatches |
| Polish + test | 6–10 | Realtime demo; race/empty states; mobile |
| Demo prep | 10–12 | Rehearse claim moment, fresh seed, pitch, last bugs |

## The demo moment

**Two browser windows side by side:** in window A, claim a plan. In window B, watch it disappear or show **Claimed** **immediately**. No narration required—the mechanic is obvious in seconds.

**Before presenting:** seed the demo area with **6–8** varied plans; include **at least two** clearly different vibes so the grid looks rich.

---

## Development

Clone the repo, configure environment variables for Supabase and Claude per project docs, then install dependencies and run the dev server when the app scaffold is in place.

---

*PlanDrop — Hackathon 2026. Ready to drop.*
