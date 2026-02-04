import z from "zod";

export const jobApplicationSchema = z
  .object({
    company: z.string().min(1, "Company name is required"),
    role: z.string().min(1, "Role is required"),
    status: z.enum(["APPLIED", "INTERVIEW", "OFFER", "REJECTED"]),
    dateApplied: z.string().min(1, "Date is required"),
    location: z.string().nullable().optional(),
    salaryMin: z
      .number()
      .int()
      .min(0, "Salary must be 0 or greater")
      .nullable()
      .optional(),
    salaryMax: z
      .number()
      .int()
      .min(0, "Salary must be 0 or greater")
      .nullable()
      .optional(),
    salaryCurrency: z
      .enum(["USD", "EUR", "GBP", "CAD", "AUD"])
      .default("USD")
      .nullable()
      .optional(),
    applicationUrl: z.string().url().nullable().optional().or(z.literal("")),
    datePosted: z.string().min(1, "Date is required"),
    notes: z.string().max(500).nullable().optional(),
  })
  .refine(
    (data) => {
      // Check if both salaryMin and salaryMax are provided
      const salaryMin = data.salaryMin ?? null;
      const salaryMax = data.salaryMax ?? null;
      return salaryMin === null || salaryMax === null || salaryMin <= salaryMax;
    },
    {
      message: "Minimum salary cannot be greater than maximum salary",
      path: ["salaryMin"], // You can also add `salaryMax` here if you want to highlight it
    }
  );

export type JobApplicationFormValues = z.infer<typeof jobApplicationSchema>;
