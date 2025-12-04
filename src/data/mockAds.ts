import { CompetitorAd } from "@/types/facebook";

export const mockAds: CompetitorAd[] = [
  {
    id: "123",
    pageId: "987654321",
    pageName: "FitPulse Coaching",
    headline: "Transform Your Fitness Routine",
    description: "Personalized coaching plans built around your schedule.",
    body: "Thousands of busy professionals trust FitPulse coaches to stay accountable without burning out. Join today and claim a free mobility assessment.",
    imageUrl:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80",
    snapshotUrl: "https://www.facebook.com/ads/library/?id=123",
    startTime: "2024-04-02T12:00:00+0000",
    stopTime: null,
    spendLower: 500,
    spendUpper: 2000,
    impressionsLower: 50000,
    impressionsUpper: 150000,
    platforms: ["facebook", "instagram"],
  },
  {
    id: "456",
    pageId: "123456789",
    pageName: "FitPulse Coaching",
    headline: "New 28-Day Accountability Challenge",
    description: "Finally stick to a plan you enjoy.",
    body: "Ready to build sustainable habits? Our 28-day challenge combines micro workouts, real-time coaching, and recovery protocols proven to keep you consistent.",
    imageUrl:
      "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?auto=format&fit=crop&w=600&q=80",
    snapshotUrl: "https://www.facebook.com/ads/library/?id=456",
    startTime: "2024-04-20T09:00:00+0000",
    stopTime: null,
    spendLower: 300,
    spendUpper: 1200,
    impressionsLower: 20000,
    impressionsUpper: 90000,
    platforms: ["facebook"],
  },
  {
    id: "789",
    pageId: "654321987",
    pageName: "FitPulse Coaching",
    headline: "The Accountability App You’ll Actually Use",
    description: "Daily nudges, expert feedback, and adaptive workouts.",
    body: "We studied the highest converting fitness ads and built a system that blends 1:1 coaching with smart reminders. See how our clients unlock consistency in under 10 minutes a day.",
    imageUrl:
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=600&q=80",
    snapshotUrl: "https://www.facebook.com/ads/library/?id=789",
    startTime: "2024-05-01T16:00:00+0000",
    stopTime: null,
    spendLower: 250,
    spendUpper: 850,
    impressionsLower: 15000,
    impressionsUpper: 40000,
    platforms: ["instagram"],
  },
];

