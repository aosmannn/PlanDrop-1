export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 py-16">
      <div className="max-w-lg text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
          Hackathon 2026
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-zinc-900">
          PlanDrop
        </h1>
        <p className="mt-4 text-lg text-zinc-600">
          Friend-group activities, first come first served. Browse plans for your
          area, claim one for your group, share the link.
        </p>
        <p className="mt-8 text-sm text-zinc-500">
          Next.js + Tailwind — deploy hook ready for Vercel.
        </p>
      </div>
    </main>
  );
}
