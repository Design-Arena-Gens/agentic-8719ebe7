'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { CompetitorForm } from "@/components/CompetitorForm";
import { AdGallery } from "@/components/AdGallery";
import { AdConceptPanel } from "@/components/AdConcept";
import { CompetitorAd, GeneratedAdConcept } from "@/types/facebook";
import { generateAdConcept } from "@/lib/ads";

const buildQueryString = (values: Record<string, string | number>) => {
  const params = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {
    if (value || value === 0) {
      params.set(key, String(value));
    }
  });
  return params.toString();
};

export function HomePage() {
  const [ads, setAds] = useState<CompetitorAd[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [conceptSeed, setConceptSeed] = useState(0);
  const [concept, setConcept] = useState<GeneratedAdConcept | null>(null);

  const fetchAds = useCallback(
    async ({
      searchTerm,
      pageId,
      country,
      adType,
      limit,
    }: {
      searchTerm: string;
      pageId: string;
      country: string;
      adType: string;
      limit: number;
    }) => {
      setIsLoading(true);
      setError(null);
      setMessage(null);
      try {
        const query = buildQueryString({
          searchTerm,
          pageId,
          country,
          adType,
          limit,
        });
        const response = await fetch(`/api/facebook/ads?${query}`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`Unable to pull ads (${response.status})`);
        }

        const payload = await response.json();
        setAds(payload.ads ?? []);
        setSource(payload.source ?? null);
        setMessage(payload.message ?? null);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : "Unable to fetch competitor ads.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (!ads.length) {
      setConcept(null);
      return;
    }

    const generated = generateAdConcept(ads);
    setConcept(generated);
  }, [ads, conceptSeed]);

  const metricSummary = useMemo(() => {
    if (!ads.length) return null;

    const totalSpend = ads.reduce((acc, ad) => acc + (ad.spendUpper ?? 0), 0);
    const totalImpressions = ads.reduce(
      (acc, ad) => acc + (ad.impressionsUpper ?? 0),
      0,
    );
    const activeAds = ads.filter((ad) => !ad.stopTime).length;

    return {
      totalSpend,
      totalImpressions,
      activeAds,
    };
  }, [ads]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-zinc-50 via-white to-zinc-100 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white/70 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-12 sm:py-20">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-1 text-xs font-medium text-zinc-600">
            <span className="inline-flex h-2 w-2 rounded-full bg-green-500" />
            Agentic Competitive Ad Intelligence
          </div>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Spy the exact hooks your competitors scale on Facebook and clone the
            angles in minutes.
          </h1>
          <p className="max-w-2xl text-lg text-zinc-600">
            Plug in a competitor, pull their active ads straight from the Meta Ad
            Library, and auto-generate a fresh concept that mirrors their winning
            structure without copying word-for-word.
          </p>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-6 py-12">
        <CompetitorForm onSubmit={fetchAds} isLoading={isLoading} />

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        ) : null}

        {message ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
            {message}
          </div>
        ) : null}

        {source ? (
          <div className="text-xs font-medium uppercase tracking-wide text-zinc-400">
            Data source:{" "}
            <span className="text-zinc-600">
              {source === "live" ? "Live Meta API" : "Sample dataset"}
            </span>
          </div>
        ) : null}

        {metricSummary ? (
          <section className="grid gap-4 rounded-2xl border border-zinc-200 bg-white/70 p-6 shadow-sm sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Ads Tracked
              </p>
              <p className="text-2xl font-semibold text-zinc-900">{ads.length}</p>
              <span className="text-xs text-zinc-500">
                {metricSummary.activeAds} currently active
              </span>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Upper Spend Estimate
              </p>
              <p className="text-2xl font-semibold text-zinc-900">
                {metricSummary.totalSpend
                  ? new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    }).format(metricSummary.totalSpend)
                  : "Not disclosed"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Impressions Potential
              </p>
              <p className="text-2xl font-semibold text-zinc-900">
                {metricSummary.totalImpressions
                  ? metricSummary.totalImpressions.toLocaleString()
                  : "Not disclosed"}
              </p>
            </div>
          </section>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <AdGallery ads={ads} />
          <AdConceptPanel
            concept={concept}
            isVisible={Boolean(ads.length)}
            onRefresh={() => setConceptSeed((prev) => prev + 1)}
          />
        </div>
      </main>

      <footer className="mt-auto border-t border-zinc-200 bg-white/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <span>Powered by live Meta Ad Library data when an access token is set.</span>
          <span>Built for acquisition teams who iterate faster than the competition.</span>
        </div>
      </footer>
    </div>
  );
}
