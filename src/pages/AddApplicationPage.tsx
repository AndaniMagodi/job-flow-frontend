import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createApplication } from "../api/application";

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

  const { register, handleSubmit, formState: { errors } } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      company: "",
      role: "",
      status: "Applied",
      date_applied: "",
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

  const onSubmit = (values: ApplicationFormValues) => {
    mutation.mutate(values);
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Add Application</h2>
        <p className="text-slate-600">Add a new job application to your tracker.</p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 rounded-2xl border bg-white p-6 shadow-sm"
      >
        <div>
          <label className="mb-1 block text-sm font-medium">Company</label>
          <input {...register("company")}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring"
            placeholder="Enter company name" />
          {errors.company && <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Role</label>
          <input {...register("role")}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring"
            placeholder="Enter role title" />
          {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Status</label>
          <select {...register("status")}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring">
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Rejected">Rejected</option>
            <option value="Offer">Offer</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Date Applied</label>
          <input type="date" {...register("date_applied")}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring" />
          {errors.date_applied && <p className="mt-1 text-sm text-red-600">{errors.date_applied.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Job Link</label>
          <input {...register("link")}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring"
            placeholder="https://example.com/job-post" />
          {errors.link && <p className="mt-1 text-sm text-red-600">{errors.link.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Notes</label>
          <textarea {...register("notes")}
            className="min-h-28 w-full rounded-lg border px-3 py-2 outline-none focus:ring"
            placeholder="Add notes about the application" />
        </div>

        {mutation.isError && (
          <p className="text-sm text-red-600">Could not save application. Please try again.</p>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {mutation.isPending ? "Saving..." : "Save Application"}
        </button>
      </form>
    </section>
  );
}