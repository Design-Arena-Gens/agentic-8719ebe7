export type RawFacebookAd = {
  id: string;
  page_id?: string;
  page_name?: string;
  ad_creative_link_captions?: string[];
  ad_creative_link_descriptions?: string[];
  ad_creative_link_titles?: string[];
  ad_creative_body?: string;
  ad_creative_images?: {
    url?: string;
    original_width?: number;
    original_height?: number;
  }[];
  ad_snapshot_url?: string;
  ad_delivery_start_time?: string;
  ad_delivery_stop_time?: string | null;
  currency?: string;
  spend?: {
    lower_bound?: string;
    upper_bound?: string;
  };
  impressions?: {
    lower_bound?: string;
    upper_bound?: string;
  };
  publisher_platforms?: string[];
  demographic_distribution?: {
    percentage: number;
    gender: string;
    age_range: string;
  }[];
};

export type CompetitorAd = {
  id: string;
  pageId: string;
  pageName: string;
  headline: string;
  description: string;
  body: string;
  imageUrl?: string;
  snapshotUrl?: string;
  startTime?: string;
  stopTime?: string | null;
  spendLower?: number;
  spendUpper?: number;
  impressionsLower?: number;
  impressionsUpper?: number;
  platforms?: string[];
};

export type GeneratedAdConcept = {
  hook: string;
  primaryText: string;
  headline: string;
  description: string;
  callToAction: string;
  creativeNotes: string[];
};

