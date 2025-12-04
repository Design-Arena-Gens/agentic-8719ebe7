import { mockAds } from "@/data/mockAds";
import {
  CompetitorAd,
  GeneratedAdConcept,
  RawFacebookAd,
} from "@/types/facebook";

const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "that",
  "your",
  "from",
  "this",
  "have",
  "will",
  "what",
  "about",
  "their",
  "they",
  "been",
  "into",
  "only",
  "does",
  "when",
  "much",
  "more",
  "than",
  "then",
  "them",
  "make",
  "made",
  "free",
  "just",
  "every",
  "over",
  "need",
  "like",
  "most",
  "take",
  "even",
  "once",
]);

const CTA_LIBRARY = [
  "Get The Playbook",
  "Claim Your Free Audit",
  "Launch My Campaign",
  "See Live Demo",
  "Download the Swipefile",
  "Reserve My Spot",
];

const CREATIVE_NOTES_POOL = [
  "Use lifestyle imagery that mirrors the competitor’s top performing assets but swap in your brand colors.",
  "Lead with a bold stat in the first three words to quickly qualify scrollers.",
  "Add a contrasting CTA button color to win the thumb-stop test on mobile feeds.",
  "Include a short testimonial screenshot in the carousel’s second frame.",
  "Test vertical video with caption overlays pulling the primary hook keywords.",
  "Pair the hook with animated motion graphics to highlight the product outcome.",
];

const KEYWORD_PRIORITIES: Record<string, string> = {
  "ai": "Position the offer as intelligence-driven rather than manual effort.",
  "automation": "Promise time savings by automating previously complex workflows.",
  "growth": "Focus on ROI and compounding gains within 30 days.",
  "clients": "Showcase social proof and speed to results.",
  "fitness": "Highlight habit consistency, expert guidance, and flexible schedules.",
  "coaching": "Emphasize tailored roadmaps and accountability.",
  "leads": "Stress pipeline visibility, qualified traffic, and conversion tracking.",
};

const CTA_DEFAULT = "Unlock the Strategy";

type KeywordInsight = {
  keyword: string;
  count: number;
};

const getBoundAsNumber = (value?: string): number | undefined => {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export const normaliseAds = (
  rawAds: RawFacebookAd[] | undefined | null,
): CompetitorAd[] => {
  if (!rawAds?.length) {
    return mockAds;
  }

  return rawAds.map((ad) => {
    const lower = getBoundAsNumber(ad.spend?.lower_bound);
    const upper = getBoundAsNumber(ad.spend?.upper_bound);
    const impressionsLower = getBoundAsNumber(ad.impressions?.lower_bound);
    const impressionsUpper = getBoundAsNumber(ad.impressions?.upper_bound);

    return {
      id: ad.id,
      pageId: ad.page_id ?? "",
      pageName: ad.page_name ?? "Unknown Page",
      headline: ad.ad_creative_link_titles?.[0] ?? "",
      description: ad.ad_creative_link_descriptions?.[0] ?? "",
      body: ad.ad_creative_body ?? "",
      imageUrl: ad.ad_creative_images?.[0]?.url,
      snapshotUrl: ad.ad_snapshot_url,
      startTime: ad.ad_delivery_start_time,
      stopTime: ad.ad_delivery_stop_time,
      spendLower: lower,
      spendUpper: upper,
      impressionsLower,
      impressionsUpper,
      platforms: ad.publisher_platforms,
    };
  });
};

const tokenize = (text: string): string[] => {
  return text
    .toLowerCase()
    .split(/[^a-z0-9+]+/g)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
};

const collectKeywords = (ads: CompetitorAd[]): KeywordInsight[] => {
  const counter = new Map<string, number>();

  ads.forEach((ad) => {
    const text = `${ad.headline} ${ad.description} ${ad.body}`;
    tokenize(text).forEach((word) => {
      counter.set(word, (counter.get(word) ?? 0) + 1);
    });
  });

  return Array.from(counter.entries())
    .map(([keyword, count]) => ({ keyword, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);
};

const pickCallToAction = (keywords: KeywordInsight[]): string => {
  const matched = keywords.find((kw) =>
    ["demo", "book", "download", "access", "guide", "playbook"].some((needle) =>
      kw.keyword.includes(needle),
    ),
  );

  if (matched) {
    if (matched.keyword.includes("demo")) return "Book Live Demo";
    if (matched.keyword.includes("download")) return "Download the Swipe File";
    if (matched.keyword.includes("guide")) return "Get the Guide";
    if (matched.keyword.includes("playbook")) return "Claim the Playbook";
  }

  return CTA_LIBRARY[Math.floor(Math.random() * CTA_LIBRARY.length)] ?? CTA_DEFAULT;
};

const buildHook = (keywords: KeywordInsight[]): string => {
  const [first, second, third] = keywords;

  if (first && second) {
    return `Still chasing ${first.keyword} without ${second.keyword}?`;
  }

  if (first && third) {
    return `What ${first.keyword} leaders know about ${third.keyword} ` + "that you don’t.";
  }

  return "Unlock the hidden pattern competitors keep from prospects.";
};

const synthesizeNotes = (keywords: KeywordInsight[]): string[] => {
  const notes = new Set<string>();

  keywords.slice(0, 5).forEach(({ keyword }) => {
    const insight = KEYWORD_PRIORITIES[keyword];
    if (insight) notes.add(insight);
  });

  while (notes.size < 3 && notes.size < CREATIVE_NOTES_POOL.length) {
    const idea =
      CREATIVE_NOTES_POOL[Math.floor(Math.random() * CREATIVE_NOTES_POOL.length)];
    notes.add(idea);
  }

  return Array.from(notes).slice(0, 4);
};

const buildPrimaryText = (
  keywords: KeywordInsight[],
  competitorName: string,
): string => {
  const [first, second, third] = keywords;
  const hookKeyword = first?.keyword ?? "results";
  const benefitKeyword = second?.keyword ?? "growth";
  const proofKeyword = third?.keyword ?? "clients";

  return [
    `We reverse-engineered ${competitorName}'s winning ads and found the ${hookKeyword} lever they push in every headline.`,
    `Now we're combining it with a fresh angle on ${benefitKeyword} that your audience hasn't seen.`,
    `See how brands like yours turn that insight into ${proofKeyword} within 14 days.`,
  ].join(" ");
};

const buildHeadline = (keywords: KeywordInsight[]): string => {
  const primary = keywords[0]?.keyword ?? "growth";
  const secondary = keywords[1]?.keyword ?? "clients";

  return `${primary.charAt(0).toUpperCase()}${primary.slice(1)} without ${secondary}?`;
};

const buildDescription = (keywords: KeywordInsight[]): string => {
  const keywordList = keywords.slice(0, 3).map((k) => k.keyword);
  return `Borrow the ${keywordList.join(", ")} playbook and launch ads that convert faster than your competitors.`;
};

export const generateAdConcept = (
  ads: CompetitorAd[],
): GeneratedAdConcept => {
  if (!ads.length) {
    return {
      hook: "We audited the top spenders in your niche and extracted the exact hook they use.",
      primaryText:
        "Use our competitor deconstruction matrix to mirror winning structures while injecting your product’s unfair advantage. Launch in under 48 hours with proven copy frameworks.",
      headline: "Swipe Their High-Performing Hook, Stand Out in 2 Days",
      description:
        "Stop guessing. Launch ads shaped by live market intel instead of inspiration boards.",
      callToAction: CTA_DEFAULT,
      creativeNotes: CREATIVE_NOTES_POOL.slice(0, 3),
    };
  }

  const keywords = collectKeywords(ads);
  const competitorName = ads[0]?.pageName ?? "the market leader";

  return {
    hook: buildHook(keywords),
    primaryText: buildPrimaryText(keywords, competitorName),
    headline: buildHeadline(keywords),
    description: buildDescription(keywords),
    callToAction: pickCallToAction(keywords),
    creativeNotes: synthesizeNotes(keywords),
  };
};

