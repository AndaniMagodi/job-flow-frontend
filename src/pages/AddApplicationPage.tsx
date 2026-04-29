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

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#222",
  border: "1px solid #2a2a2a",
  borderRadius: 10,
  padding: "10px 12px",
  fontSize: 13,
  color: "#ddd",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  color: "#555",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  marginBottom: 6,
};

const errorStyle: React.CSSProperties = {
  fontSize: 11,
  color: "#f87171",
  marginTop: 4,
};

export default function AddApplicationPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors } } = useForm<ApplicationFormValues>({
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
    <section style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.5px", margin: 0 }}>
          Log an application
        </h2>
        <p style={{ fontSize: 13, color: "#555", marginTop: 4 }}>
          Add a job you've applied to or are about to apply for.
        </p>
      </div>

      <form
        onSubmit={handleSubmit((v) => mutation.mutate(v))}
        style={{ background: "#1a1a1a", border: "1px solid #222", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label style={labelStyle}>Company</label>
            <input {...register("company")} style={inputStyle} placeholder="e.g. Anthropic" />
            {errors.company && <p style={errorStyle}>{errors.company.message}</p>}
          </div>
          <div>
            <label style={labelStyle}>Role</label>
            <input {...register("role")} style={inputStyle} placeholder="e.g. Frontend Developer" />
            {errors.role && <p style={errorStyle}>{errors.role.message}</p>}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label style={labelStyle}>Status</label>
            <select
              {...register("status")}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Date applied</label>
            <input type="date" {...register("date_applied")} style={inputStyle} />
            {errors.date_applied && <p style={errorStyle}>{errors.date_applied.message}</p>}
          </div>
        </div>

        <div>
          <label style={labelStyle}>Job link</label>
          <input {...register("link")} style={inputStyle} placeholder="https://linkedin.com/jobs/..." />
          {errors.link && <p style={errorStyle}>{errors.link.message}</p>}
        </div>

        <div>
          <label style={labelStyle}>Notes</label>
          <textarea
            {...register("notes")}
            style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
            placeholder="Recruiter name, referral, anything worth remembering..."
          />
        </div>

        {mutation.isError && (
          <p style={{ fontSize: 12, color: "#f87171", background: "#2d1515", border: "1px solid #3d2020", borderRadius: 8, padding: "8px 12px" }}>
            Could not save. Please try again.
          </p>
        )}

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            type="submit"
            disabled={mutation.isPending}
            style={{ background: "#6366f1", color: "#fff", fontSize: 13, fontWeight: 600, padding: "10px 20px", borderRadius: 20, border: "none", cursor: "pointer", opacity: mutation.isPending ? 0.6 : 1 }}
          >
            {mutation.isPending ? "Saving..." : "Save application"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/applications")}
            style={{ background: "transparent", color: "#555", fontSize: 13, padding: "10px 16px", borderRadius: 20, border: "1px solid #2a2a2a", cursor: "pointer" }}
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}