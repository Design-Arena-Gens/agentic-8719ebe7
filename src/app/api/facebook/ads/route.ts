import { normaliseAds } from "@/lib/ads";
import { mockAds } from "@/data/mockAds";
import { RawFacebookAd } from "@/types/facebook";
import { NextRequest, NextResponse } from "next/server";

const GRAPH_ENDPOINT = "https://graph.facebook.com/v18.0/ads_archive";
const DEFAULT_LIMIT = 25;

const REQUEST_FIELDS = [
  "id",
  "page_id",
  "page_name",
  "ad_creative_body",
  "ad_creative_link_titles",
  "ad_creative_link_descriptions",
  "ad_creative_link_captions",
  "ad_creative_link_deep_link_url",
  "ad_creative_images",
  "ad_snapshot_url",
  "ad_delivery_start_time",
  "ad_delivery_stop_time",
  "impressions",
  "spend",
  "publisher_platforms",
].join(",");

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const searchTerm = searchParams.get("searchTerm") ?? "";
  const pageId = searchParams.get("pageId") ?? "";
  const country = searchParams.get("country") ?? "US";
  const adType = searchParams.get("adType") ?? "ALL";
  const limitParam = Number.parseInt(searchParams.get("limit") ?? "", 10);
  const limit =
    Number.isFinite(limitParam) && limitParam > 0 && limitParam <= 100
      ? limitParam
      : DEFAULT_LIMIT;

  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
  const fallbackResponse = NextResponse.json(
    {
      ads: mockAds,
      source: "mock",
      message:
        "Falling back to sample data. Set FACEBOOK_ACCESS_TOKEN to fetch live competitor ads.",
    },
    { status: 200 },
  );

  if (!accessToken) {
    return fallbackResponse;
  }

  const params = new URLSearchParams({
    access_token: accessToken,
    ad_active_status: "ALL",
    ad_reached_countries: country,
    ad_type: adType,
    fields: REQUEST_FIELDS,
    limit: limit.toString(),
    search_terms: searchTerm,
  });

  if (pageId) {
    params.set("search_page_ids", pageId);
  }

  if (!searchTerm) {
    params.delete("search_terms");
  }

  const requestUrl = `${GRAPH_ENDPOINT}?${params.toString()}`;

  try {
    const response = await fetch(requestUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Facebook API error", response.status, errorText);
      return fallbackResponse;
    }

    const payload = (await response.json()) as {
      data?: RawFacebookAd[];
    };

    const ads = normaliseAds(payload.data);

    return NextResponse.json(
      {
        ads,
        source: "live",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to fetch Facebook ads", error);
    return fallbackResponse;
  }
}

