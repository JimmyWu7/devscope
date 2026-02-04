"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  JobApplicationFormValues,
  jobApplicationSchema,
} from "./job-application-schema";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { mutate } from "swr";

function toDateInputValue(value?: string | Date) {
  if (!value) return "";

  if (value instanceof Date) {
    return value.toISOString().split("T")[0];
  }
  // already a YYYY-MM-DD string
  return value;
}

export function AddJobApplicationDialog() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state
  // Refs for salary inputs error
  const salaryMinRef = useRef<HTMLInputElement | null>(null);
  const salaryMaxRef = useRef<HTMLInputElement | null>(null);

  // console.log("Users Local Time", getLocalDateString());
  // console.log("Date", new Date())

  const today = new Date().toISOString().split("T")[0];

  const form = useForm<JobApplicationFormValues>({
    resolver: zodResolver(jobApplicationSchema),
    defaultValues: {
      company: "",
      role: "",
      status: "APPLIED",
      dateApplied: today,
      location: "",
      salaryMin: null,
      salaryMax: null,
      salaryCurrency: "USD",
      applicationUrl: "",
      datePosted: today,
      notes: "",
    },
  });

  // Check for validation errors and focus the fields if needed
  useEffect(() => {
    const error =
      form.formState.errors.salaryMin || form.formState.errors.salaryMax;
    if (error && salaryMinRef.current) {
      // Focus salaryMin field if there's an error with salaryMin > salaryMax
      salaryMinRef.current.focus();
    }
  }, [form.formState.errors]);

  async function onSubmit(data: JobApplicationFormValues) {
    try {
      setIsSubmitting(true);
      const normalized = {
        ...data,
        location: data.location?.trim() || null,
        applicationUrl: data.applicationUrl?.trim() || null,
        notes: data.notes?.trim() || null,
        salaryMin: data.salaryMin ?? null,
        salaryMax: data.salaryMax ?? null,
        salaryCurrency:
          data.salaryMin || data.salaryMax
            ? data.salaryCurrency ?? "USD"
            : null,
      };
      // console.log("Submit Normalized", normalized)

      const res = await fetch("/api/job-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(normalized),
      });

      const responseData = await res.json();

      if (res.ok) {
        toast.success("Job application added");
        await mutate("/api/job-applications");
        form.reset();
        setOpen(false);
      } else {
        toast.error(responseData.error ?? "Failed to add job application");
      }
    } catch {
      toast.error("Job application submission went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Add Job Application</Button>
      </DialogTrigger>

      <DialogContent className="w-full max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Add Job Application</DialogTitle>
        </DialogHeader>

        <Card className="w-full sm:max-w-md">
          <CardHeader>
            <CardTitle>Job Application Form</CardTitle>
            <CardDescription>
              Fill out the details of your application.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              id="job-application-form"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FieldGroup>
                {/* Company */}
                <Controller
                  name="company"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Company</FieldLabel>
                      <Input {...field} placeholder="Acme Inc." />
                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Role */}
                <Controller
                  name="role"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Role</FieldLabel>
                      <Input {...field} placeholder="Frontend Engineer" />
                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Location */}
                <Controller
                  name="location"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Location</FieldLabel>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder="New York, NY"
                      />
                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                      <CardDescription>
                        Optional: Location of the job.
                      </CardDescription>
                    </Field>
                  )}
                />

                {/* Salary */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Salary Min */}
                  <Controller
                    name="salaryMin"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Salary Min</FieldLabel>
                        <Input
                          type="number"
                          inputMode="numeric"
                          min={0}
                          value={field.value ?? ""}
                          ref={salaryMinRef}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? undefined
                                : Math.max(0, Number(e.target.value))
                            )
                          }
                          placeholder="50000"
                        />
                        {fieldState.error && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  {/* Salary Max */}
                  <Controller
                    name="salaryMax"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Salary Max</FieldLabel>
                        <Input
                          type="number"
                          inputMode="numeric"
                          min={0}
                          value={field.value ?? ""}
                          ref={salaryMaxRef}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? undefined
                                : Math.max(0, Number(e.target.value))
                            )
                          }
                          placeholder="70000"
                        />
                        {fieldState.error && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  {/* Currency */}
                  <Controller
                    name="salaryCurrency"
                    control={form.control}
                    render={({ field }) => (
                      <Field>
                        <FieldLabel>Currency</FieldLabel>
                        <Select
                          value={field.value ?? "USD"} // never undefined
                          onValueChange={(value) =>
                            field.onChange(value === "" ? null : value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="USD" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                            <SelectItem value="CAD">CAD</SelectItem>
                            <SelectItem value="AUD">AUD</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    )}
                  />
                </div>

                {/* Application URL */}
                <Controller
                  name="applicationUrl"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Application URL</FieldLabel>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder="https://..."
                      />
                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                      <FieldDescription>
                        Optional: URL of the job application.
                      </FieldDescription>
                    </Field>
                  )}
                />

                {/* Status */}
                <Controller
                  name="status"
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Status</FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="APPLIED">Applied</SelectItem>
                          <SelectItem value="INTERVIEW">Interview</SelectItem>
                          <SelectItem value="OFFER">Offer</SelectItem>
                          <SelectItem value="REJECTED">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />

                {/* Date Applied */}
                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    name="dateApplied"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Date Applied</FieldLabel>
                        <Input
                          type="date"
                          max={today}
                          value={toDateInputValue(field.value)}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                        {fieldState.error && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  {/* Date Posted */}
                  <Controller
                    name="datePosted"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Date Posted</FieldLabel>
                        <Input
                          type="date"
                          max={today}
                          value={toDateInputValue(field.value)}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                        {fieldState.error && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                        <FieldDescription>
                          Optional: date when the job was posted.
                        </FieldDescription>
                      </Field>
                    )}
                  />
                </div>
                {/* Notes */}
                <Controller
                  name="notes"
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Notes</FieldLabel>
                      <InputGroup>
                        <InputGroupTextarea
                          {...field}
                          value={field.value ?? ""}
                          placeholder="Follow-up date, recruiter, etc."
                          rows={4}
                        />
                        <InputGroupAddon align="block-end">
                          <InputGroupText className="tabular-nums">
                            {field.value}/500
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                      <FieldDescription>
                        Optional notes about the application.
                      </FieldDescription>
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
          </CardContent>

          <CardFooter className="justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button
              type="submit"
              form="job-application-form"
              disabled={form.formState.isSubmitting}
            >
              <LoadingSwap isLoading={isSubmitting}>Submit</LoadingSwap>
            </Button>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
