'use client';

import { useState } from "react";

type FormValues = {
  searchTerm: string;
  pageId: string;
  country: string;
  adType: string;
  limit: number;
};

type Props = {
  onSubmit: (values: FormValues) => Promise<void>;
  isLoading: boolean;
};

const adTypeOptions = [
  { value: "ALL", label: "All Ads" },
  { value: "POLITICAL_AND_ISSUE_ADS", label: "Political & Issue" },
  { value: "HOUSING", label: "Housing" },
  { value: "CREDIT", label: "Credit" },
  { value: "EMPLOYMENT", label: "Employment" },
];

const popularCountries = [
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "GB", label: "United Kingdom" },
  { value: "AU", label: "Australia" },
  { value: "DE", label: "Germany" },
];

export function CompetitorForm({ onSubmit, isLoading }: Props) {
  const [form, setForm] = useState<FormValues>({
    searchTerm: "",
    pageId: "",
    country: "US",
    adType: "ALL",
    limit: 15,
  });

  const handleChange = <Key extends keyof FormValues>(
    key: Key,
    value: FormValues[Key],
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.searchTerm && !form.pageId) {
      return;
    }
    await onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative mx-auto flex w-full max-w-4xl flex-col gap-6 rounded-xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur md:flex-row md:items-end"
    >
      <div className="flex flex-1 flex-col gap-2">
        <label className="text-sm font-medium text-zinc-700">
          Competitor Keyword
        </label>
        <input
          value={form.searchTerm}
          onChange={(event) => handleChange("searchTerm", event.target.value)}
          placeholder="e.g., fitbit, crm, meal prep"
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm shadow-inner transition hover:border-zinc-300 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
        />
        <p className="text-xs text-zinc-500">
          We match on Page names, ad headlines, and primary text. Provide a
          product, brand, or vertical keyword.
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <label className="text-sm font-medium text-zinc-700">
          Page ID (optional)
        </label>
        <input
          value={form.pageId}
          onChange={(event) => handleChange("pageId", event.target.value)}
          placeholder="Numerical Page ID for precise targeting"
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm shadow-inner transition hover:border-zinc-300 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
        />
        <p className="text-xs text-zinc-500">
          Drop in the Facebook Page ID to only track a single advertiser.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-700">
          Country
        </label>
        <select
          value={form.country}
          onChange={(event) => handleChange("country", event.target.value)}
          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm shadow-inner focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
        >
          {popularCountries.map((country) => (
            <option key={country.value} value={country.value}>
              {country.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-700">
          Ad Type
        </label>
        <select
          value={form.adType}
          onChange={(event) => handleChange("adType", event.target.value)}
          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm shadow-inner focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
        >
          {adTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-700">
          Results
        </label>
        <input
          type="number"
          min={1}
          max={100}
          value={form.limit}
          onChange={(event) =>
            handleChange("limit", Number(event.target.value) || 10)
          }
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm shadow-inner focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex h-11 items-center justify-center rounded-lg bg-black px-6 text-sm font-semibold text-white shadow transition hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-black/30 disabled:cursor-not-allowed disabled:bg-zinc-500"
      >
        {isLoading ? "Pulling ads…" : "Track ads"}
      </button>
    </form>
  );
}

