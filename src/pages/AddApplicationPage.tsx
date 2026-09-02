import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createApplication } from "../api/application";
import { STATUS_ORDER } from "../lib/status";

const applicationSchema = z.object({
  company: z.string().min(2, "Company is required"),
  role: z.string().min(2, "Role is required"),
  status: z.enum(["Applied", "Interview", "Rejected", "Offer"]),
  date_applied: z.string().min(1, "Date applied is required"),
  link: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  notes: z.string().optional(),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

export default function AddApplicationPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      company: "",
      role: "",
      status: "Applied",
      date_applied: new Date().toISOString().slice(0, 10),
      link: "",
      notes: "",
    },
  });

  const mutation = useMutation({
    mutationFn: createApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      navigate("/applications");
    },
  });

  return (
    <section className="mx-auto max-w-2xl">
      <header className="mb-6">
        <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-[var(--foreground)]">
          Log an application
        </h1>
        <p className="mt-1 text-[14.5px] text-[var(--muted-foreground)]">
          For a job you applied to outside the board.
        </p>
      </header>

      <form
        onSubmit={handleSubmit((values) => mutation.mutate(values))}
        className="jf-card flex flex-col gap-4 p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Company" error={errors.company?.message} htmlFor="company">
            <input
              id="company"
              className="jf-input"
              placeholder="e.g. Yoco"
              {...register("company")}
            />
          </Field>

          <Field label="Role" error={errors.role?.message} htmlFor="role">
            <input
              id="role"
              className="jf-input"
              placeholder="e.g. Frontend Developer"
              {...register("role")}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Status" htmlFor="status">
            <select id="status" className="jf-input cursor-pointer" {...register("status")}>
              {STATUS_ORDER.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Date applied"
            error={errors.date_applied?.message}
            htmlFor="date_applied"
          >
            <input
              id="date_applied"
              type="date"
              className="jf-input"
              {...register("date_applied")}
            />
          </Field>
        </div>

        <Field label="Job link" error={errors.link?.message} htmlFor="link">
          <input
            id="link"
            className="jf-input"
            placeholder="https://www.pnet.co.za/jobs/..."
            {...register("link")}
          />
        </Field>

        <Field label="Notes" htmlFor="notes">
          <textarea
            id="notes"
            className="jf-input min-h-24 resize-y font-[inherit] leading-relaxed"
            placeholder="Recruiter name, referral, anything worth remembering…"
            {...register("notes")}
          />
        </Field>

        {mutation.isError && (
          <p
            role="alert"
            className="rounded-lg bg-[var(--destructive-soft)] px-3.5 py-3 text-[13px] text-[var(--destructive)]"
          >
            Could not save. Please try again.
          </p>
        )}

        <div className="flex items-center gap-2.5">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="rounded-lg bg-[var(--primary)] px-5 py-2.5 text-[13.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {mutation.isPending ? "Saving…" : "Save application"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/applications")}
            className="rounded-lg border border-[var(--input)] bg-white px-4 py-2.5 text-[13.5px] font-medium text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)]"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="jf-label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-[12.5px] text-[var(--destructive)]">{error}</p>
      )}
    </div>
  );
}
