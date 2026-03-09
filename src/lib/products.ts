/* ─────────────────────────────────────────
   Premium PDF product catalogue
   ───────────────────────────────────────── */

export type ProductType = "Notes" | "Past Papers" | "Practice" | "Guide" | "Revision";

export interface Product {
  id: string;
  subject: string;
  title: string;
  subtitle: string;
  price: number;
  pages: number;
  type: ProductType;
  description: string;
  highlights: string[];
  /** Tailwind-compatible inline gradient string for the cover placeholder */
  coverGradient: string;
  coverAccent: string;
  subjectColor: string;
  subjectBg: string;
  subjectBorder: string;
  updatedYear: number;
  fileSize: string;
}

export const PRODUCTS: Product[] = [
  /* ── Mathematics ── */
  {
    id: "math-algebra-complete",
    subject: "Mathematics",
    title: "Algebra & Equations",
    subtitle: "Complete Unit Notes",
    price: 250,
    pages: 52,
    type: "Notes",
    description:
      "A comprehensive unit covering linear equations, simultaneous equations, quadratic equations, and algebraic fractions — fully aligned with the 2025 G.C.E. O/L syllabus. Every topic includes worked examples, common pitfalls, and examiner-style practice questions.",
    highlights: [
      "Full 2025 syllabus alignment",
      "80+ worked examples with step-by-step solutions",
      "Examiner tips on every topic",
      "Formula reference sheet included",
      "Printable & digital-friendly layout",
    ],
    coverGradient: "linear-gradient(135deg, rgba(96,165,250,0.22) 0%, rgba(10,10,10,0.85) 100%)",
    coverAccent: "rgba(96,165,250,0.3)",
    subjectColor: "#93c5fd",
    subjectBg: "rgba(96,165,250,0.12)",
    subjectBorder: "rgba(96,165,250,0.3)",
    updatedYear: 2025,
    fileSize: "4.2 MB",
  },
  {
    id: "math-geometry-pack",
    subject: "Mathematics",
    title: "Geometry & Mensuration",
    subtitle: "Illustrated Practice Pack",
    price: 290,
    pages: 64,
    type: "Practice",
    description:
      "Annotated diagrams, full theorem proofs, and 120 graded practice questions covering circles, triangles, areas, volumes, and surface areas. Ideal for students who struggle with the visual side of Mathematics.",
    highlights: [
      "120 graded practice questions",
      "All theorems with illustrated proofs",
      "3D mensuration fully covered",
      "Model answers for every question",
      "Common exam mistake guide",
    ],
    coverGradient: "linear-gradient(135deg, rgba(59,130,246,0.22) 0%, rgba(10,10,10,0.85) 100%)",
    coverAccent: "rgba(59,130,246,0.3)",
    subjectColor: "#93c5fd",
    subjectBg: "rgba(96,165,250,0.12)",
    subjectBorder: "rgba(96,165,250,0.3)",
    updatedYear: 2025,
    fileSize: "5.8 MB",
  },
  {
    id: "math-past-papers-5yr",
    subject: "Mathematics",
    title: "5-Year Past Papers",
    subtitle: "2019 – 2024 with Marking Schemes",
    price: 350,
    pages: 96,
    type: "Past Papers",
    description:
      "Every official G.C.E. O/L Mathematics past paper from 2019 to 2024, reproduced in full with the official Department of Examinations marking schemes. Indispensable for timed practice and understanding exactly what the examiners reward.",
    highlights: [
      "5 complete exam years included",
      "Official marking schemes for all papers",
      "Examiner comments on high-scoring answers",
      "Topic-indexed question finder",
      "Clean, print-ready formatting",
    ],
    coverGradient: "linear-gradient(135deg, rgba(124,31,255,0.22) 0%, rgba(10,10,10,0.85) 100%)",
    coverAccent: "rgba(124,31,255,0.3)",
    subjectColor: "#93c5fd",
    subjectBg: "rgba(96,165,250,0.12)",
    subjectBorder: "rgba(96,165,250,0.3)",
    updatedYear: 2024,
    fileSize: "9.1 MB",
  },

  /* ── Combined Science ── */
  {
    id: "science-biology-unit1",
    subject: "Combined Science",
    title: "Biology — Unit 1",
    subtitle: "Cell Biology & Life Processes",
    price: 260,
    pages: 58,
    type: "Notes",
    description:
      "Premium illustrated notes covering cell structure, cell division, transport in plants and animals, and the chemistry of life. Diagrams are exam-standard and fully labelled, making recall effortless.",
    highlights: [
      "Exam-standard labelled diagrams",
      "Summary comparison tables",
      "50 short-answer practice questions",
      "Mnemonic aids for difficult content",
      "Linked to 2025 syllabus checkpoints",
    ],
    coverGradient: "linear-gradient(135deg, rgba(16,185,129,0.22) 0%, rgba(10,10,10,0.85) 100%)",
    coverAccent: "rgba(16,185,129,0.3)",
    subjectColor: "#6ee7b7",
    subjectBg: "rgba(16,185,129,0.1)",
    subjectBorder: "rgba(16,185,129,0.28)",
    updatedYear: 2025,
    fileSize: "6.4 MB",
  },
  {
    id: "science-chemistry-revision",
    subject: "Combined Science",
    title: "Chemistry Rapid Revision",
    subtitle: "Reactions, Equations & Acids",
    price: 240,
    pages: 44,
    type: "Revision",
    description:
      "A fast-track revision pack for O/L Chemistry — balancing equations, acid-base reactions, electrolysis, and organic chemistry condensed into clean, scannable pages. Perfect for the final 4 weeks before the exam.",
    highlights: [
      "Rapid-revision format (1 page per topic)",
      "All key equations & reactions",
      "Colour-coded reaction types",
      "30 MCQ practice questions",
      "Last-minute checklist included",
    ],
    coverGradient: "linear-gradient(135deg, rgba(52,211,153,0.2) 0%, rgba(10,10,10,0.85) 100%)",
    coverAccent: "rgba(52,211,153,0.28)",
    subjectColor: "#6ee7b7",
    subjectBg: "rgba(16,185,129,0.1)",
    subjectBorder: "rgba(16,185,129,0.28)",
    updatedYear: 2025,
    fileSize: "3.5 MB",
  },

  /* ── English Language ── */
  {
    id: "english-essay-masterclass",
    subject: "English Language",
    title: "Essay Writing Masterclass",
    subtitle: "Argumentative & Descriptive",
    price: 220,
    pages: 40,
    type: "Guide",
    description:
      "A step-by-step guide to crafting distinction-worthy essays. Covers planning strategies, paragraph structure, transitional language, vocabulary variety, and the specific rubric examiners use to award marks at O/L.",
    highlights: [
      "Full essay structure framework",
      "15 model essays with annotations",
      "Band descriptor analysis",
      "500 high-impact vocabulary list",
      "Common errors and how to fix them",
    ],
    coverGradient: "linear-gradient(135deg, rgba(167,139,250,0.22) 0%, rgba(10,10,10,0.85) 100%)",
    coverAccent: "rgba(167,139,250,0.3)",
    subjectColor: "#c4b5fd",
    subjectBg: "rgba(124,31,255,0.1)",
    subjectBorder: "rgba(124,31,255,0.28)",
    updatedYear: 2025,
    fileSize: "3.8 MB",
  },
  {
    id: "english-grammar-complete",
    subject: "English Language",
    title: "Grammar Complete",
    subtitle: "Tenses, Voice & Reported Speech",
    price: 230,
    pages: 48,
    type: "Notes",
    description:
      "Every grammar topic tested at O/L — tenses, active/passive voice, direct/indirect speech, conditionals, relative clauses, and more — explained clearly with hundreds of practice exercises and answer keys.",
    highlights: [
      "All O/L grammar topics covered",
      "200+ practice exercises with answers",
      "Quick-reference grammar tables",
      "Exam error correction practice",
      "Printable grammar cheat sheet",
    ],
    coverGradient: "linear-gradient(135deg, rgba(139,92,246,0.22) 0%, rgba(10,10,10,0.85) 100%)",
    coverAccent: "rgba(139,92,246,0.3)",
    subjectColor: "#c4b5fd",
    subjectBg: "rgba(124,31,255,0.1)",
    subjectBorder: "rgba(124,31,255,0.28)",
    updatedYear: 2025,
    fileSize: "4.6 MB",
  },

  /* ── History ── */
  {
    id: "history-modern-notes",
    subject: "History",
    title: "Modern World History",
    subtitle: "1800 – 1950 Complete Notes",
    price: 260,
    pages: 72,
    type: "Notes",
    description:
      "Detailed notes covering the Industrial Revolution, World Wars, colonial independence movements, and early 20th-century political upheavals — all contextualised for the Sri Lankan O/L curriculum with cause-effect analysis frameworks.",
    highlights: [
      "Visual timelines for every era",
      "Cause & consequence analysis charts",
      "Key figures quick-reference guide",
      "Essay answer frameworks",
      "20 structured practice questions",
    ],
    coverGradient: "linear-gradient(135deg, rgba(251,191,36,0.2) 0%, rgba(10,10,10,0.85) 100%)",
    coverAccent: "rgba(245,158,11,0.28)",
    subjectColor: "#fcd34d",
    subjectBg: "rgba(245,158,11,0.1)",
    subjectBorder: "rgba(245,158,11,0.28)",
    updatedYear: 2025,
    fileSize: "7.2 MB",
  },

  /* ── ICT ── */
  {
    id: "ict-theory-complete",
    subject: "ICT",
    title: "ICT Theory Complete",
    subtitle: "Hardware, Software & Networks",
    price: 240,
    pages: 54,
    type: "Notes",
    description:
      "Comprehensive theory notes for the ICT Paper A exam. Covers computer architecture, data representation, operating systems, networking, cybersecurity, and the social impact of technology — with clear definitions and exam-focused summaries.",
    highlights: [
      "All Paper A theory topics covered",
      "Definitions formatted for direct exam use",
      "Network diagrams & explanations",
      "MCQ practice for every chapter",
      "Glossary of 150 ICT key terms",
    ],
    coverGradient: "linear-gradient(135deg, rgba(56,189,248,0.22) 0%, rgba(10,10,10,0.85) 100%)",
    coverAccent: "rgba(56,189,248,0.3)",
    subjectColor: "#7dd3fc",
    subjectBg: "rgba(56,189,248,0.1)",
    subjectBorder: "rgba(56,189,248,0.28)",
    updatedYear: 2025,
    fileSize: "5.1 MB",
  },
  {
    id: "ict-practical-guide",
    subject: "ICT",
    title: "Practical Exam Guide",
    subtitle: "Word, Excel & Presentation",
    price: 270,
    pages: 60,
    type: "Guide",
    description:
      "A task-by-task practical guide for the ICT Paper B exam. Step-by-step screenshots and instructions for Microsoft Word, Excel, and PowerPoint tasks at O/L level, plus a set of 10 mock practical exams with solutions.",
    highlights: [
      "Step-by-step screenshot instructions",
      "10 complete mock practical exams",
      "Common examiner deductions listed",
      "Keyboard shortcut reference card",
      "Works with Office 2019 and 365",
    ],
    coverGradient: "linear-gradient(135deg, rgba(14,165,233,0.22) 0%, rgba(10,10,10,0.85) 100%)",
    coverAccent: "rgba(14,165,233,0.3)",
    subjectColor: "#7dd3fc",
    subjectBg: "rgba(56,189,248,0.1)",
    subjectBorder: "rgba(56,189,248,0.28)",
    updatedYear: 2025,
    fileSize: "8.3 MB",
  },

  /* ── Geography ── */
  {
    id: "geography-physical-notes",
    subject: "Geography",
    title: "Physical Geography",
    subtitle: "Landforms, Climate & Ecosystems",
    price: 240,
    pages: 56,
    type: "Notes",
    description:
      "In-depth notes on physical geography for O/L — plate tectonics, river systems, coastal processes, climate zones, and ecosystem types. Every section has exam-standard sketch maps and annotated diagram templates.",
    highlights: [
      "Exam-standard sketch maps included",
      "Annotated diagram templates",
      "Climate data interpretation guide",
      "Case studies from Sri Lanka & Asia",
      "25 structured exam-style questions",
    ],
    coverGradient: "linear-gradient(135deg, rgba(74,222,128,0.2) 0%, rgba(10,10,10,0.85) 100%)",
    coverAccent: "rgba(74,222,128,0.26)",
    subjectColor: "#86efac",
    subjectBg: "rgba(74,222,128,0.1)",
    subjectBorder: "rgba(74,222,128,0.26)",
    updatedYear: 2025,
    fileSize: "6.0 MB",
  },
  {
    id: "geography-sl-development",
    subject: "Geography",
    title: "Sri Lanka — Development",
    subtitle: "Population, Industry & Resources",
    price: 220,
    pages: 46,
    type: "Notes",
    description:
      "Focused notes on Sri Lanka's human and economic geography — population distribution, agriculture, industry, transport networks, and natural resource management. Directly mapped to the O/L syllabus topics on Sri Lankan development.",
    highlights: [
      "Sri Lanka-specific case studies",
      "Updated 2022 census data",
      "Map-based analysis questions",
      "Economic geography diagrams",
      "Syllabus-matched topic checklist",
    ],
    coverGradient: "linear-gradient(135deg, rgba(34,197,94,0.2) 0%, rgba(10,10,10,0.85) 100%)",
    coverAccent: "rgba(34,197,94,0.24)",
    subjectColor: "#86efac",
    subjectBg: "rgba(74,222,128,0.1)",
    subjectBorder: "rgba(74,222,128,0.26)",
    updatedYear: 2025,
    fileSize: "4.7 MB",
  },
];

export const SUBJECTS = ["All", ...Array.from(new Set(PRODUCTS.map((p) => p.subject)))] as const;

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
