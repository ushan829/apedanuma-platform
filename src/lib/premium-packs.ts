export interface Feature {
  text: string;
}

export interface Pack {
  id: string;
  name: string;
  subject: string;
  price: number;
  originalPrice?: number;
  featured: boolean;
  badge?: string;
  tagline: string;
  features: Feature[];
  icon: string;
  accentColor: string;
}

export const PACKS: Pack[] = [
  {
    id: "math",
    name: "O/L Mathematics Masterclass",
    subject: "Mathematics",
    price: 1490,
    originalPrice: 2200,
    featured: false,
    tagline: "From foundations to full marks",
    icon: "∑",
    accentColor: "arcane",
    features: [
      { text: "Complete 2025 Syllabus Coverage" },
      { text: "300+ Worked Examples" },
      { text: "Model Paper Answers (2018–2024)" },
      { text: "Chapter Summary Sheets" },
      { text: "Instant PDF Download" },
      { text: "Free Updates Included" },
    ],
  },
  {
    id: "bundle",
    name: "Complete O/L Bundle",
    subject: "All 9 Core Subjects",
    price: 3990,
    originalPrice: 7800,
    featured: true,
    badge: "Most Popular",
    tagline: "Everything you need — one bundle",
    icon: "◈",
    accentColor: "gold",
    features: [
      { text: "All 9 Core Subject Packs" },
      { text: "1,200+ Pages of Premium Notes" },
      { text: "Model Answers & Marking Schemes" },
      { text: "24/7 Discord Study Community" },
      { text: "Monthly Q&A with Educators" },
      { text: "Lifetime Access & Free Updates" },
      { text: "Certificate of Completion" },
    ],
  },
  {
    id: "science",
    name: "O/L Science Elite Pack",
    subject: "Combined Science",
    price: 1490,
    originalPrice: 2200,
    featured: false,
    tagline: "Biology, Chemistry & Physics unified",
    icon: "⬡",
    accentColor: "arcane",
    features: [
      { text: "Full Biology, Chemistry & Physics" },
      { text: "Diagram-Rich Illustrated Notes" },
      { text: "Practical Lab Notes & Tips" },
      { text: "MCQ Bank (500+ Questions)" },
      { text: "Essay Answer Templates" },
      { text: "Instant PDF Download" },
    ],
  },
];
