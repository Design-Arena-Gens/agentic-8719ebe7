'use client';

import { useMemo } from "react";
import { CompetitorAd } from "@/types/facebook";
import { format } from "date-fns";

type Props = {
  ads: CompetitorAd[];
};

const formatCurrency = (value?: number) => {
  if (!value) return undefined;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (value?: string | null) => {
  if (!value) return undefined;
  try {
    return format(new Date(value), "MMM d, yyyy");
  } catch {
    return undefined;
  }
};

const platformsLabel = (platforms?: string[]) => {
  if (!platforms?.length) return "Unknown placement";
  return platforms.map((platform) => platform.replace(/_/g, " ")).join(", ");
};

export function AdGallery({ ads }: Props) {
  const groupedAds = useMemo(() => {
    const byPage = new Map<string, CompetitorAd[]>();
    ads.forEach((ad) => {
      const key = ad.pageName || "Unknown Advertiser";
      const existing = byPage.get(key) ?? [];
      existing.push(ad);
      byPage.set(key, existing);
    });
    return Array.from(byPage.entries());
  }, [ads]);

  if (!ads.length) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-white/50 p-12 text-center text-sm text-zinc-500">
        No ads yet. Run a search to pull live intelligence or use the sample data.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {groupedAds.map(([pageName, pageAds]) => (
        <section key={pageName} className="flex flex-col gap-4">
          <header className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold text-zinc-900">{pageName}</h2>
            <p className="text-sm text-zinc-500">
              {pageAds.length} active creative{pageAds.length > 1 ? "s" : ""} tracked
            </p>
          </header>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {pageAds.map((ad) => {
              const spendBounds = [
                formatCurrency(ad.spendLower),
                formatCurrency(ad.spendUpper),
              ].filter(Boolean);

              const impressionBounds = [
                ad.impressionsLower?.toLocaleString(),
                ad.impressionsUpper?.toLocaleString(),
              ].filter(Boolean);

              return (
                <article
                  key={ad.id}
                  className="flex h-full flex-col gap-4 rounded-2xl border border-zinc-200 bg-white/90 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  {ad.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={ad.imageUrl}
                      alt={ad.headline}
                      className="h-44 w-full rounded-xl object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-44 w-full items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50 text-xs text-zinc-400">
                      No creative preview
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-semibold leading-tight text-zinc-900">
                        {ad.headline || "Untitled Headline"}
                      </h3>
                      {ad.snapshotUrl ? (
                        <a
                          href={ad.snapshotUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900"
                        >
                          View Live
                        </a>
                      ) : null}
                    </div>

                    <p className="text-sm text-zinc-600 line-clamp-3">{ad.body}</p>

                    <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
                      {formatDate(ad.startTime) ? (
                        <span>Started {formatDate(ad.startTime)}</span>
                      ) : null}
                      {formatDate(ad.stopTime) ? (
                        <span>Ended {formatDate(ad.stopTime)}</span>
                      ) : null}
                      <span>{platformsLabel(ad.platforms)}</span>
                    </div>

                    <dl className="grid grid-cols-2 gap-3 text-xs text-zinc-500">
                      <div className="rounded-lg bg-zinc-50 p-3">
                        <dt className="font-medium text-zinc-700">Spend</dt>
                        <dd>
                          {spendBounds.length
                            ? spendBounds.join(" – ")
                            : "Not disclosed"}
                        </dd>
                      </div>
                      <div className="rounded-lg bg-zinc-50 p-3">
                        <dt className="font-medium text-zinc-700">Impressions</dt>
                        <dd>
                          {impressionBounds.length
                            ? impressionBounds.join(" – ")
                            : "Not disclosed"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

