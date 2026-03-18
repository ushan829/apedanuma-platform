/* ─────────────────────────────────────────
   Shared types, data & helpers for the
   Free Resources library & detail pages
   ───────────────────────────────────────── */

export type Grade = 10 | 11;
export type MaterialType =
  | "all"
  | "term-test"
  | "short-notes"
  | "unit-test"
  | "textbooks"
  | "ol-past-papers"
  | "marking-schemes";
export type TermFilter = 1 | 2 | 3;

export interface FreeResource {
  id: string;
  title: string;
  subject: string;
  grade: Grade;
  type: Exclude<MaterialType, "all">;
  term?: TermFilter;
  pages: number;
  size: string;
  year?: number;
  description: string;
}

/* ─────────────────────────────────────────
   Subject categories (used in sidebar accordions)
   ───────────────────────────────────────── */
export const SUBJECT_CATEGORIES: { id: string; label: string; subjects: string[] }[] = [
  {
    id: "main",
    label: "Main Subjects",
    subjects: ["Science", "Mathematics", "English", "History"],
  },
  {
    id: "religion",
    label: "Religion",
    subjects: ["Buddhism", "Hinduism", "Catholicism", "Christianity", "Islam"],
  },
  {
    id: "language",
    label: "Language & Literature",
    subjects: ["Sinhala Language & Literature", "Tamil Language & Literature"],
  },
  {
    id: "cat1",
    label: "Category 1 Subjects",
    subjects: [
      "Business & Accounting Studies", "Geography", "Civics", "Entrepreneurship",
      "Second Language (Sinhala)", "Second Language (Tamil)", "Pali", "Sanskrit",
      "French", "German", "Hindi", "Japanese", "Arabic", "Korean", "Chinese", "Russian",
    ],
  },
  {
    id: "cat2",
    label: "Category 2 Subjects",
    subjects: [
      "Music (Oriental)", "Music (Western)", "Music (Carnatic)", "Art",
      "Dancing (National)", "Dancing (Bharata)",
      "English Literature Appreciation", "Sinhala Literature Appreciation",
      "Tamil Literature Appreciation", "Arabic Literature Appreciation",
      "Drama & Theatre (English)",
    ],
  },
  {
    id: "cat3",
    label: "Category 3 Subjects",
    subjects: [
      "ICT", "Agriculture & Food Technology", "Aquatic Resources Technology",
      "Design & Arts", "Home Economics", "Health & PE", "Communication & Media",
      "Design & Construction", "Design & Mechanical", "E-type & Short Hand (English)",
    ],
  },
];

/* ─────────────────────────────────────────
   DB materialType → sidebar filter category
   ───────────────────────────────────────── */
export const FILTER_TO_DB_TYPES: Record<string, string[]> = {
  "term-test":       ["Term Test Paper"],
  "short-notes":     ["Short Note"],
  "unit-test":       ["Model Paper", "Revision Paper", "MCQ Paper", "Essay Guide"],
  "textbooks":       [],
  "ol-past-papers":  ["Past Paper"],
  "marking-schemes": ["Marking Scheme"],
};

export function getFilterType(materialType: string): string {
  for (const [key, types] of Object.entries(FILTER_TO_DB_TYPES)) {
    if (types.includes(materialType)) return key;
  }
  return "all";
}

/* ─────────────────────────────────────────
   Style helpers
   ───────────────────────────────────────── */
export function getSubjectStyle(subject: string): { color: string; bg: string; border: string } {
  const map: Record<string, { color: string; bg: string; border: string }> = {
    "Science":                       { color: "#6ee7b7", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.28)" },
    "Mathematics":                   { color: "#93c5fd", bg: "rgba(96,165,250,0.1)",  border: "rgba(96,165,250,0.28)" },
    "English":                       { color: "#c4b5fd", bg: "rgba(124,31,255,0.12)", border: "rgba(124,31,255,0.3)"  },
    "History":                       { color: "#fcd34d", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.28)" },
    "ICT":                           { color: "#7dd3fc", bg: "rgba(56,189,248,0.1)",  border: "rgba(56,189,248,0.28)" },
    "Geography":                     { color: "#86efac", bg: "rgba(74,222,128,0.1)",  border: "rgba(74,222,128,0.26)" },
    "Buddhism":                      { color: "#fda4af", bg: "rgba(244,63,94,0.1)",   border: "rgba(244,63,94,0.26)"  },
    "Hinduism":                      { color: "#fb923c", bg: "rgba(249,115,22,0.1)",  border: "rgba(249,115,22,0.26)" },
    "Catholicism":                   { color: "#a5f3fc", bg: "rgba(6,182,212,0.1)",   border: "rgba(6,182,212,0.26)"  },
    "Christianity":                  { color: "#a5f3fc", bg: "rgba(6,182,212,0.1)",   border: "rgba(6,182,212,0.26)"  },
    "Islam":                         { color: "#bbf7d0", bg: "rgba(34,197,94,0.1)",   border: "rgba(34,197,94,0.24)"  },
    "Business & Accounting Studies": { color: "#fdba74", bg: "rgba(249,115,22,0.1)",  border: "rgba(249,115,22,0.24)" },
  };
  return map[subject] ?? { color: "#a0a0a0", bg: "rgba(160,160,160,0.08)", border: "rgba(160,160,160,0.2)" };
}

export const TYPE_META: Record<string, { label: string; shortLabel: string; color: string; bg: string; border: string }> = {
  "term-test":       { label: "Term Test Papers", shortLabel: "Term Test",   color: "#93c5fd", bg: "rgba(96,165,250,0.12)",  border: "rgba(96,165,250,0.28)"  },
  "short-notes":     { label: "Short Notes",      shortLabel: "Short Note",  color: "#6ee7b7", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.28)"  },
  "unit-test":       { label: "Unit Test Papers",  shortLabel: "Unit Test",   color: "#fcd34d", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.28)"  },
  "textbooks":       { label: "Text Books",        shortLabel: "Text Book",   color: "#c4b5fd", bg: "rgba(124,31,255,0.12)", border: "rgba(124,31,255,0.28)"  },
  "ol-past-papers":  { label: "O/L Past Papers",   shortLabel: "Past Paper",  color: "#fda4af", bg: "rgba(244,63,94,0.12)",  border: "rgba(244,63,94,0.26)"   },
  "marking-schemes": { label: "Marking Schemes",   shortLabel: "Mark Scheme", color: "#fdba74", bg: "rgba(249,115,22,0.12)", border: "rgba(249,115,22,0.26)"  },
};

/* ─────────────────────────────────────────
   Resource data — 41 O/L materials
   ───────────────────────────────────────── */
export const FREE_RESOURCES: FreeResource[] = [
  /* ── Grade 10 — Mathematics ── */
  {
    id: "g10-math-t1",
    title: "Mathematics Term 1 Test Paper 2024",
    subject: "Mathematics", grade: 10, type: "term-test", term: 1,
    pages: 12, size: "1.1 MB", year: 2024,
    description: "A full Term 1 test paper for Grade 10 Mathematics covering Number Systems, Algebra basics, and introductory Geometry. Structured in the same format as actual school examinations with Part A (MCQ) and Part B (structured questions).",
  },
  {
    id: "g10-math-t2",
    title: "Mathematics Term 2 Test Paper 2024",
    subject: "Mathematics", grade: 10, type: "term-test", term: 2,
    pages: 14, size: "1.3 MB", year: 2024,
    description: "Grade 10 Term 2 Mathematics paper covering Fractions, Ratios & Proportion, Percentage, and an introduction to Statistics. Includes worked answer guidelines for self-marking.",
  },
  {
    id: "g10-math-notes",
    title: "Algebra & Functions — Short Notes",
    subject: "Mathematics", grade: 10, type: "short-notes",
    pages: 32, size: "2.8 MB",
    description: "Concise, exam-focused short notes covering the full Algebra and Functions syllabus for Grade 10. Includes all key formulas, factorisation methods, and 40 practice questions with answers.",
  },
  {
    id: "g10-math-unit",
    title: "Geometry Unit Test Paper",
    subject: "Mathematics", grade: 10, type: "unit-test",
    pages: 8, size: "0.9 MB",
    description: "A focused unit test on Geometry for Grade 10, covering angle theorems, properties of triangles and quadrilaterals, and circle theorems. Marking scheme included.",
  },
  /* ── Grade 10 — Science ── */
  {
    id: "g10-sci-t2",
    title: "Science Term 2 Test Paper 2024",
    subject: "Science", grade: 10, type: "term-test", term: 2,
    pages: 16, size: "1.5 MB", year: 2024,
    description: "Comprehensive Term 2 Science test paper for Grade 10, spanning Biology (cell division, transport), Chemistry (acids and bases), and Physics (forces and motion).",
  },
  {
    id: "g10-sci-notes",
    title: "Cell Biology & Life Processes — Notes",
    subject: "Science", grade: 10, type: "short-notes",
    pages: 44, size: "3.6 MB",
    description: "Detailed illustrated notes on Cell Biology for Grade 10, covering cell structure and organelles, cell division, diffusion and osmosis, and photosynthesis. All diagrams are exam-standard and fully labelled.",
  },
  {
    id: "g10-sci-tb",
    title: "Science Textbook (Grade 10)",
    subject: "Science", grade: 10, type: "textbooks",
    pages: 220, size: "18.2 MB",
    description: "The complete Grade 10 Combined Science textbook covering the full Biology, Chemistry, and Physics curriculum. Fully aligned to the 2025 G.C.E. O/L syllabus with chapter summaries and review questions.",
  },
  {
    id: "g10-sci-unit",
    title: "Chemistry Unit Test — Acids & Bases",
    subject: "Science", grade: 10, type: "unit-test",
    pages: 6, size: "0.7 MB",
    description: "A concise unit test specifically targeting the Acids, Bases, and Salts topic in Grade 10 Chemistry. Covers pH scale, neutralisation, indicators, and salt preparation methods.",
  },
  /* ── Grade 10 — English ── */
  {
    id: "g10-eng-t3",
    title: "English Term 3 Test Paper 2024",
    subject: "English", grade: 10, type: "term-test", term: 3,
    pages: 10, size: "0.8 MB", year: 2024,
    description: "Grade 10 English Language Term 3 paper with reading comprehension, grammar transformation exercises, letter writing, and a short essay. Reflects the current examination structure used in leading national schools.",
  },
  {
    id: "g10-eng-notes",
    title: "Grammar & Comprehension — Short Notes",
    subject: "English", grade: 10, type: "short-notes",
    pages: 36, size: "2.4 MB",
    description: "Short notes covering all essential English grammar topics for Grade 10: tenses, active/passive voice, reported speech, conditionals, and reading comprehension strategies with model answers.",
  },
  /* ── Grade 10 — History ── */
  {
    id: "g10-hist-unit",
    title: "Ancient Civilisations Unit Test",
    subject: "History", grade: 10, type: "unit-test",
    pages: 8, size: "0.9 MB",
    description: "A focused unit test on Ancient World Civilisations (Egypt, Mesopotamia, Indus Valley, China) for Grade 10 History. Includes structured essay questions and a visual timeline exercise.",
  },
  {
    id: "g10-hist-notes",
    title: "Sri Lankan History — Summary Notes",
    subject: "History", grade: 10, type: "short-notes",
    pages: 48, size: "4.1 MB",
    description: "Comprehensive summary notes on Sri Lankan History for Grade 10, covering ancient kingdoms, colonial periods, and the independence movement. Includes cause-and-effect analysis charts and key dates at a glance.",
  },
  /* ── Grade 10 — ICT ── */
  {
    id: "g10-ict-notes",
    title: "ICT Theory & Applications Notes",
    subject: "ICT", grade: 10, type: "short-notes",
    pages: 38, size: "3.2 MB",
    description: "Short notes for Grade 10 ICT Theory covering hardware, software, operating systems, data representation, and the basics of networking. Includes definitions formatted for direct exam use.",
  },
  {
    id: "g10-ict-t1",
    title: "ICT Term 1 Test Paper 2024",
    subject: "ICT", grade: 10, type: "term-test", term: 1,
    pages: 10, size: "0.9 MB", year: 2024,
    description: "Grade 10 ICT Term 1 examination paper covering input/output devices, computer software categories, and basic file management. Includes both MCQ and structured answer sections.",
  },
  /* ── Grade 10 — Buddhism ── */
  {
    id: "g10-bud-notes",
    title: "Buddhism Short Notes — Grade 10",
    subject: "Buddhism", grade: 10, type: "short-notes",
    pages: 42, size: "3.5 MB",
    description: "Concise summary notes on Buddhism for Grade 10, covering the life of the Buddha, the Dhamma, the Sangha, and early Buddhist history in Sri Lanka. Prepared according to the current syllabus.",
  },
  {
    id: "g10-bud-t2",
    title: "Buddhism Term 2 Test Paper 2024",
    subject: "Buddhism", grade: 10, type: "term-test", term: 2,
    pages: 8, size: "0.8 MB", year: 2024,
    description: "Grade 10 Buddhism Term 2 test paper with short answer and essay questions on the Jataka stories, the First Council, and the spread of Buddhism to Sri Lanka.",
  },
  /* ── Grade 10 — Business ── */
  {
    id: "g10-bus-unit",
    title: "Business Studies Unit Test Paper",
    subject: "Business & Accounting Studies", grade: 10, type: "unit-test",
    pages: 10, size: "1.0 MB",
    description: "A unit test paper on Introduction to Business and Entrepreneurship for Grade 10, covering types of business, business environments, and basic accounting concepts. Marking guidelines included.",
  },
  /* ── Grade 10 — Geography ── */
  {
    id: "g10-geo-notes",
    title: "Physical Geography Notes — Grade 10",
    subject: "Geography", grade: 10, type: "short-notes",
    pages: 40, size: "3.4 MB",
    description: "Illustrated short notes on Physical Geography for Grade 10 covering landforms, rivers, climate, and natural disasters. Includes annotated sketch maps and diagram labelling templates.",
  },
  {
    id: "g10-geo-t1",
    title: "Geography Term 1 Test Paper 2024",
    subject: "Geography", grade: 10, type: "term-test", term: 1,
    pages: 10, size: "1.0 MB", year: 2024,
    description: "Grade 10 Geography Term 1 paper covering map reading, plate tectonics, and weathering processes. Includes map-based questions with answer guidelines.",
  },
  /* ── Grade 11 — Mathematics ── */
  {
    id: "g11-math-past23",
    title: "O/L Mathematics Past Paper 2023",
    subject: "Mathematics", grade: 11, type: "ol-past-papers",
    pages: 20, size: "2.1 MB", year: 2023,
    description: "The official G.C.E. O/L Mathematics past paper from 2023, reproduced in full. Covers the complete syllabus across Paper I (MCQ) and Paper II (structured). Essential for authentic timed practice.",
  },
  {
    id: "g11-math-past22",
    title: "O/L Mathematics Past Paper 2022",
    subject: "Mathematics", grade: 11, type: "ol-past-papers",
    pages: 20, size: "2.0 MB", year: 2022,
    description: "Official G.C.E. O/L Mathematics Past Paper 2022. Use alongside the marking scheme for comprehensive self-assessment and to identify gaps before the examination.",
  },
  {
    id: "g11-math-mark23",
    title: "Mathematics Marking Scheme 2023",
    subject: "Mathematics", grade: 11, type: "marking-schemes",
    pages: 8, size: "0.9 MB", year: 2023,
    description: "Official Department of Examinations marking scheme for the 2023 G/C.E. O/L Mathematics paper. Includes full model answers, mark allocations, and examiner notes on common errors.",
  },
  {
    id: "g11-math-notes",
    title: "Trigonometry & Statistics — Notes",
    subject: "Mathematics", grade: 11, type: "short-notes",
    pages: 40, size: "3.4 MB",
    description: "Focused revision notes for Grade 11 Mathematics on Trigonometry (ratios, identities, equations) and Statistics (mean, median, mode, standard deviation, cumulative frequency). Fully worked examples throughout.",
  },
  {
    id: "g11-math-t2",
    title: "Mathematics Term 2 Mock Paper 2024",
    subject: "Mathematics", grade: 11, type: "term-test", term: 2,
    pages: 14, size: "1.2 MB", year: 2024,
    description: "A high-quality mock paper for Grade 11 Mathematics Term 2, designed to mirror the difficulty and structure of the O/L examination. Covers Algebra, Mensuration, and Functions.",
  },
  /* ── Grade 11 — Science ── */
  {
    id: "g11-sci-past23",
    title: "O/L Science Past Paper 2023",
    subject: "Science", grade: 11, type: "ol-past-papers",
    pages: 24, size: "2.8 MB", year: 2023,
    description: "Complete official O/L Combined Science past paper from 2023. Covers all three sciences (Biology, Chemistry, Physics) in the standard exam format. Recommended for timed practice 8 weeks before the exam.",
  },
  {
    id: "g11-sci-mark23",
    title: "Science Marking Scheme 2023",
    subject: "Science", grade: 11, type: "marking-schemes",
    pages: 10, size: "1.1 MB", year: 2023,
    description: "Official 2023 O/L Science marking scheme with complete model answers, acceptable alternative responses, and mark allocations by section. Use with the past paper for accurate self-grading.",
  },
  {
    id: "g11-sci-notes",
    title: "Physics & Chemistry Revision Notes",
    subject: "Science", grade: 11, type: "short-notes",
    pages: 52, size: "4.6 MB",
    description: "Comprehensive Grade 11 revision notes for Physics (waves, electricity, magnetism) and Chemistry (organic chemistry, electrolysis, rates of reaction). Diagram-rich and exam-syllabus aligned.",
  },
  {
    id: "g11-sci-t3",
    title: "Science Term 3 Test Paper 2024",
    subject: "Science", grade: 11, type: "term-test", term: 3,
    pages: 16, size: "1.4 MB", year: 2024,
    description: "Grade 11 Science Term 3 mock examination paper prepared by experienced teachers. Covers all higher-level content added in the second year including genetics, modern physics, and industrial chemistry.",
  },
  /* ── Grade 11 — English ── */
  {
    id: "g11-eng-past23",
    title: "O/L English Language Past Paper 2023",
    subject: "English", grade: 11, type: "ol-past-papers",
    pages: 16, size: "1.9 MB", year: 2023,
    description: "The 2023 G.C.E. O/L English Language past paper with all sections: reading comprehension, letter writing, essay, and language usage. Ideal for understanding the current examiner expectations.",
  },
  {
    id: "g11-eng-past22",
    title: "O/L English Language Past Paper 2022",
    subject: "English", grade: 11, type: "ol-past-papers",
    pages: 16, size: "1.8 MB", year: 2022,
    description: "Official 2022 G.C.E. O/L English Language examination paper. Widely used by teachers as a benchmark assessment in the final semester of Grade 11.",
  },
  {
    id: "g11-eng-notes",
    title: "Essay Writing & Comprehension Notes",
    subject: "English", grade: 11, type: "short-notes",
    pages: 36, size: "3.0 MB",
    description: "Expert-curated notes on Essay Writing (argumentative, descriptive, narrative) and Reading Comprehension techniques for Grade 11. Includes 12 model essays with band-descriptor annotations.",
  },
  {
    id: "g11-eng-mark",
    title: "English Language Marking Scheme 2023",
    subject: "English", grade: 11, type: "marking-schemes",
    pages: 6, size: "0.7 MB", year: 2023,
    description: "Official Department of Examinations marking scheme for the 2023 O/L English Language paper. Includes acceptable answer ranges and examiner guidance on common errors in essay and comprehension sections.",
  },
  /* ── Grade 11 — History ── */
  {
    id: "g11-hist-past23",
    title: "O/L History Past Paper 2023",
    subject: "History", grade: 11, type: "ol-past-papers",
    pages: 18, size: "2.0 MB", year: 2023,
    description: "2023 G.C.E. O/L History past paper covering Modern World History, Asian civilisations, and Sri Lankan post-independence history. Full paper reproduced in original format.",
  },
  {
    id: "g11-hist-mark23",
    title: "History Marking Scheme 2023",
    subject: "History", grade: 11, type: "marking-schemes",
    pages: 8, size: "0.9 MB", year: 2023,
    description: "Official marking scheme for the 2023 O/L History paper with detailed model answers for all structured questions and essay sections, including acceptable alternative historical interpretations.",
  },
  {
    id: "g11-hist-notes",
    title: "Modern World History — Revision Notes",
    subject: "History", grade: 11, type: "short-notes",
    pages: 58, size: "5.0 MB",
    description: "Detailed Grade 11 revision notes on Modern World History (1800–1950): Industrial Revolution, World Wars, colonial independence movements, and 20th-century geopolitics, all structured for the O/L essay format.",
  },
  /* ── Grade 11 — ICT ── */
  {
    id: "g11-ict-past23",
    title: "O/L ICT Past Paper 2023",
    subject: "ICT", grade: 11, type: "ol-past-papers",
    pages: 14, size: "1.5 MB", year: 2023,
    description: "Official 2023 G.C.E. O/L ICT past paper covering Theory (Paper A) questions on hardware, software, networks, and data security.",
  },
  {
    id: "g11-ict-notes",
    title: "Database & Programming Notes",
    subject: "ICT", grade: 11, type: "short-notes",
    pages: 46, size: "4.0 MB",
    description: "Comprehensive Grade 11 ICT notes on Database Management (tables, queries, forms) and Programming concepts (algorithms, flowcharts, pseudocode). Includes step-by-step screenshots and practice exercises.",
  },
  {
    id: "g11-ict-unit",
    title: "ICT Unit Test — Networking & Systems",
    subject: "ICT", grade: 11, type: "unit-test",
    pages: 10, size: "1.0 MB",
    description: "A focused unit test for Grade 11 ICT on Networking (LAN, WAN, protocols, IP addressing) and Systems Analysis. Structured to match the O/L Paper A examination style.",
  },
  /* ── Grade 11 — Geography ── */
  {
    id: "g11-geo-past23",
    title: "O/L Geography Past Paper 2023",
    subject: "Geography", grade: 11, type: "ol-past-papers",
    pages: 16, size: "1.7 MB", year: 2023,
    description: "Complete 2023 G.C.E. O/L Geography past paper covering Physical Geography, Human Geography, and Sri Lankan regional geography with map-based questions.",
  },
  /* ── Grade 11 — Buddhism ── */
  {
    id: "g11-bud-past23",
    title: "O/L Buddhism Past Paper 2023",
    subject: "Buddhism", grade: 11, type: "ol-past-papers",
    pages: 14, size: "1.5 MB", year: 2023,
    description: "Official 2023 G.C.E. O/L Buddhism past paper with sections on the life of the Buddha, Dhamma teachings, and the spread of Buddhism. Essential for final revision.",
  },
  {
    id: "g11-bud-notes",
    title: "Buddhism Revision Notes — Grade 11",
    subject: "Buddhism", grade: 11, type: "short-notes",
    pages: 50, size: "4.2 MB",
    description: "Complete Grade 11 Buddhism revision notes covering all Dhamma topics, Jataka stories, the history of the Sangha, and higher Buddhist philosophy relevant to the O/L examination.",
  },
];

export function getResource(id: string): FreeResource | undefined {
  return FREE_RESOURCES.find((r) => r.id === id);
}
