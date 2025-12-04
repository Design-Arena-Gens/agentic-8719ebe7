'use client';

import { GeneratedAdConcept } from "@/types/facebook";
import { useState } from "react";

type Props = {
  concept: GeneratedAdConcept | null;
  isVisible: boolean;
  onRefresh: () => void;
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

export function AdConceptPanel({ concept, isVisible, onRefresh }: Props) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isVisible) return null;

  const handleCopy = async (field: string, text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2200);
    }
  };

  if (!concept) {
    return (
      <aside className="flex flex-col gap-4 rounded-2xl border border-dashed border-zinc-300 bg-white/40 p-8 text-center text-sm text-zinc-500">
        Pull competitive ads first, then we’ll reverse-engineer a matching concept for you.
      </aside>
    );
  }

  return (
    <aside className="flex flex-col gap-5 rounded-2xl border border-zinc-200 bg-white/90 p-8 shadow-sm">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900">
            Mirror Their Winning Angle
          </h3>
          <p className="text-sm text-zinc-500">
            Built from live competitor copy. Swipe the pieces you need, remix, launch.
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-900"
        >
          Refresh angle
        </button>
      </header>

      <section className="flex flex-col gap-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
          Hook
        </span>
        <p className="rounded-xl bg-zinc-50 px-4 py-3 text-sm leading-relaxed text-zinc-800">
          {concept.hook}
        </p>
        <button
          type="button"
          onClick={() => handleCopy("hook", concept.hook)}
          className="self-start text-xs font-semibold text-black transition hover:text-zinc-600"
        >
          {copiedField === "hook" ? "Copied" : "Copy hook"}
        </button>
      </section>

      <section className="flex flex-col gap-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
          Primary Text
        </span>
        <p className="rounded-xl bg-zinc-50 px-4 py-3 text-sm leading-relaxed text-zinc-800">
          {concept.primaryText}
        </p>
        <button
          type="button"
          onClick={() => handleCopy("primaryText", concept.primaryText)}
          className="self-start text-xs font-semibold text-black transition hover:text-zinc-600"
        >
          {copiedField === "primaryText" ? "Copied" : "Copy primary text"}
        </button>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Headline
          </span>
          <p className="rounded-xl bg-zinc-50 px-4 py-3 text-sm leading-relaxed text-zinc-800">
            {concept.headline}
          </p>
          <button
            type="button"
            onClick={() => handleCopy("headline", concept.headline)}
            className="self-start text-xs font-semibold text-black transition hover:text-zinc-600"
          >
            {copiedField === "headline" ? "Copied" : "Copy headline"}
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Description
          </span>
          <p className="rounded-xl bg-zinc-50 px-4 py-3 text-sm leading-relaxed text-zinc-800">
            {concept.description}
          </p>
          <button
            type="button"
            onClick={() => handleCopy("description", concept.description)}
            className="self-start text-xs font-semibold text-black transition hover:text-zinc-600"
          >
            {copiedField === "description" ? "Copied" : "Copy description"}
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-semibold text-white">
          Suggested CTA: {concept.callToAction}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
          Creative Notes
        </span>
        <ul className="flex list-disc flex-col gap-2 rounded-xl bg-zinc-50 px-6 py-4 text-sm leading-relaxed text-zinc-800">
          {concept.creativeNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>
    </aside>
  );
}

