"use client";

import { useEffect, useState } from "react";

/** Endings for “What are we doing …” — short, whole phrases (reads cleanly while typing). */
const SUFFIXES = [
  "tonight?",
  "this weekend?",
  "after work?",
  "for real?",
] as const;

const TYPING_MS = 72;
const DELETING_MS = 42;
const PAUSE_AT_WORD_MS = 2600;
const PAUSE_BETWEEN_MS = 420;

export function HeroHeadline() {
  const [text, setText] = useState("");
  const [showCaret, setShowCaret] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setText(SUFFIXES[0]);
      return;
    }

    let phraseIndex = 0;
    let buf = "";
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const clear = () => {
      if (timer != null) {
        clearTimeout(timer);
        timer = null;
      }
    };

    const step = () => {
      if (cancelled) return;
      const target = SUFFIXES[phraseIndex % SUFFIXES.length];

      if (buf.length < target.length) {
        buf = target.slice(0, buf.length + 1);
        setText(buf);
        timer = setTimeout(step, TYPING_MS);
        return;
      }

      /* word complete — pause, then delete */
      timer = setTimeout(() => {
        if (cancelled) return;
        const del = () => {
          if (cancelled) return;
          if (buf.length > 0) {
            buf = buf.slice(0, -1);
            setText(buf);
            timer = setTimeout(del, DELETING_MS);
          } else {
            phraseIndex += 1;
            timer = setTimeout(step, PAUSE_BETWEEN_MS);
          }
        };
        del();
      }, PAUSE_AT_WORD_MS);
    };

    timer = setTimeout(step, 450);

    return () => {
      cancelled = true;
      clear();
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;
    const id = window.setInterval(() => setShowCaret((c) => !c), 530);
    return () => window.clearInterval(id);
  }, []);

  return (
    <h1 className="font-display mt-8 block text-balance text-center text-[1.625rem] font-bold leading-[1.25] tracking-[-0.02em] text-zinc-900 sm:text-[2rem] sm:leading-[1.12] lg:text-[2.5rem]">
      <span className="text-zinc-900">What are we doing </span>
      <span className="font-semibold text-brand" aria-live="polite">
        {text}
        <span
          className={`ml-px inline-block w-[0.45em] text-brand ${showCaret ? "opacity-100" : "opacity-35"}`}
          aria-hidden
        >
          |
        </span>
      </span>
    </h1>
  );
}
