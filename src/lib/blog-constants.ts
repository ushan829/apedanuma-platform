export const BLOG_CATEGORY_VALUES = [
  "Study Tips",
  "Exam Strategy",
  "Subject Guide",
  "Past Paper Analysis",
  "Platform Update",
  "Student Success",
  "Parent Guide",
  "General",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORY_VALUES)[number];
