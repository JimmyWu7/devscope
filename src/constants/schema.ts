import { z } from "zod";

export const jobApplicationStatusSchema = z.enum([
  "APPLIED",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
]);

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const jobAppSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  status: jobApplicationStatusSchema,
  dateApplied: z.date(),
  location: z.string().optional(),
  salaryMin: z.number().int().positive().optional(),
  salaryMax: z.number().int().positive().optional(),
  salaryCurrency: z.string().optional(),
  applicationUrl: z.url().optional(),
  datePosted: z.date().optional(),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Task = z.infer<typeof jobAppSchema>;
