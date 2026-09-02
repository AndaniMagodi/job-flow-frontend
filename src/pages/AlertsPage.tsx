import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, BellOff, Loader2, MessageCircle, Trash2 } from "lucide-react";
import {
  createAlert,
  deleteAlert,
  getAlertChannels,
  getAlerts,
  previewAlert,
  updateAlert,
} from "../api/alerts";
import { getJobFacets } from "../api/jobs";
import type { JobFilters } from "../types/job";

export default function AlertsPage() {
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState<{ id: number; text: string } | null>(null);

  const alertsQuery = useQuery({ queryKey: ["alerts"], queryFn: getAlerts });
  const channelsQuery = useQuery({ queryKey: ["alert-channels"], queryFn: getAlertChannels });
  const { data: facets } = useQuery({ queryKey: ["job-facets"], queryFn: getJobFacets });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["alerts"] });

  const create = useMutation({ mutationFn: createAlert, onSuccess: invalidate });
  const remove = useMutation({ mutationFn: deleteAlert, onSuccess: invalidate });
  const toggle = useMutation({
    mutationFn: ({ id, is_active }: { id: number; is_active: boolean }) =>
      updateAlert(id, { is_active }),
    onSuccess: invalidate,
  });
  const runPreview = useMutation({
    mutationFn: previewAlert,
    onSuccess: (data) =>
      setPreview({
        id: data.alert_id,
        text: data.preview ?? "No new jobs match this alert right now.",
      }),
  });

  const alerts = alertsQuery.data ?? [];
  const whatsappLive = channelsQuery.data?.available.includes("whatsapp") ?? false;

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-6">
        <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-[var(--foreground)]">
          Job alerts
        </h1>
        <p className="mt-1 text-[14.5px] text-[var(--muted-foreground)]">
          Get a WhatsApp when a job matching your search is posted. Good roles
          go fast — this way you don't have to keep checking.
        </p>
      </header>

      {channelsQuery.data && !whatsappLive && (
        <p className="mb-5 rounded-lg bg-[var(--warning-soft)] px-4 py-3 text-[13px] leading-relaxed text-[var(--warning)]">
          <strong className="font-semibold">WhatsApp isn't connected yet.</strong>{" "}
          Alerts are saved and matched, but messages are only written to the
          server log until a WhatsApp Business account is configured.
        </p>
      )}

      <NewAlertForm
        facets={facets}
        onSubmit={(input) => create.mutate(input)}
        isSaving={create.isPending}
        error={create.error as Error | null}
      />

      {alertsQuery.isLoading && (
        <div className="jf-card mt-5 grid place-items-center py-12">
          <Loader2 size={20} className="animate-spin text-[var(--muted-foreground)]" />
        </div>
      )}

      {alerts.length === 0 && !alertsQuery.isLoading && (
        <div className="jf-card mt-5 grid place-items-center gap-2 py-12 text-center">
          <Bell size={26} className="text-[var(--muted-foreground)]" />
          <p className="text-[15px] font-medium text-[var(--foreground)]">
            No alerts yet
          </p>
          <p className="text-[13.5px] text-[var(--muted-foreground)]">
            Create one above and we'll message you when something matches.
          </p>
        </div>
      )}

      <div className="mt-5 grid gap-3">
        {alerts.map((alert) => (
          <article key={alert.id} className="jf-card p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-[15px] font-semibold text-[var(--foreground)]">
                  {alert.name}
                </h2>
                <p className="mt-1 flex items-center gap-1.5 text-[13px] text-[var(--muted-foreground)]">
                  <MessageCircle size={13} />
                  {formatNumber(alert.destination)}
                </p>
                <FilterSummary filters={alert.filters} />
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={() =>
                    toggle.mutate({ id: alert.id, is_active: !alert.is_active })
                  }
                  className="rounded-lg p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)]"
                  aria-label={alert.is_active ? "Pause alert" : "Resume alert"}
                  title={alert.is_active ? "Pause" : "Resume"}
                >
                  {alert.is_active ? (
                    <Bell size={16} className="text-[var(--primary)]" />
                  ) : (
                    <BellOff size={16} />
                  )}
                </button>
                <button
                  onClick={() => remove.mutate(alert.id)}
                  className="rounded-lg p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--destructive)]"
                  aria-label="Delete alert"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => runPreview.mutate(alert.id)}
                disabled={runPreview.isPending}
                className="rounded-lg border border-[var(--input)] bg-white px-3.5 py-2 text-[13px] font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--muted)] disabled:opacity-50"
              >
                Preview
              </button>
              {!alert.is_active && (
                <span className="text-[12.5px] text-[var(--muted-foreground)]">
                  Paused
                </span>
              )}
              {alert.last_notified_at && (
                <span className="text-[12.5px] text-[var(--muted-foreground)]">
                  Last sent {new Date(alert.last_notified_at).toLocaleDateString("en-ZA")}
                </span>
              )}
            </div>

            {preview?.id === alert.id && (
              <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-[var(--muted)] px-3.5 py-3 font-[inherit] text-[13px] leading-relaxed text-[var(--foreground)]">
                {preview.text}
              </pre>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

function NewAlertForm({
  facets,
  onSubmit,
  isSaving,
  error,
}: {
  facets?: { provinces: string[]; categories: string[]; opportunity_types: string[] };
  onSubmit: (input: { name: string; filters: JobFilters; destination: string }) => void;
  isSaving: boolean;
  error: Error | null;
}) {
  const [name, setName] = useState("");
  const [destination, setDestination] = useState("");
  const [province, setProvince] = useState("");
  const [category, setCategory] = useState("");
  const [opportunityType, setOpportunityType] = useState("");

  const canSubmit = name.trim().length >= 2 && destination.trim().length > 0;

  return (
    <form
      className="jf-card p-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit) return;
        onSubmit({
          name: name.trim(),
          destination: destination.trim(),
          filters: {
            province: province || undefined,
            category: category || undefined,
            opportunity_type: opportunityType || undefined,
          },
        });
        setName("");
      }}
    >
      <h2 className="text-[14px] font-semibold text-[var(--foreground)]">
        Create an alert
      </h2>

      <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
        <div>
          <label className="jf-label" htmlFor="alert-name">
            Name it
          </label>
          <input
            id="alert-name"
            className="jf-input"
            placeholder="e.g. Junior IT in Gauteng"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="jf-label" htmlFor="alert-number">
            WhatsApp number
          </label>
          <input
            id="alert-number"
            className="jf-input"
            placeholder="082 123 4567"
            inputMode="tel"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-3.5 grid gap-3.5 sm:grid-cols-3">
        <Select
          id="alert-opportunity"
          label="Opportunity"
          value={opportunityType}
          options={facets?.opportunity_types ?? []}
          placeholder="Anything"
          onChange={setOpportunityType}
        />
        <Select
          id="alert-province"
          label="Province"
          value={province}
          options={facets?.provinces ?? []}
          placeholder="Anywhere"
          onChange={setProvince}
        />
        <Select
          id="alert-category"
          label="Sector"
          value={category}
          options={facets?.categories ?? []}
          placeholder="Any sector"
          onChange={setCategory}
        />
      </div>

      {error && (
        <p role="alert" className="mt-3 text-[13px] text-[var(--destructive)]">
          {error.message}
        </p>
      )}

      <button
        type="submit"
        disabled={!canSubmit || isSaving}
        className="mt-4 rounded-lg bg-[var(--primary)] px-5 py-2.5 text-[13.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        {isSaving ? "Saving…" : "Create alert"}
      </button>
    </form>
  );
}

function Select({
  id,
  label,
  value,
  options,
  placeholder,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: string[];
  placeholder: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="jf-label" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className="jf-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function FilterSummary({ filters }: { filters: JobFilters }) {
  const parts = [
    filters.opportunity_type,
    filters.category,
    filters.province,
    filters.experience_level,
    filters.is_remote ? "Remote" : null,
    filters.no_experience_required ? "No experience needed" : null,
  ].filter(Boolean) as string[];

  if (parts.length === 0) {
    return (
      <p className="mt-2 text-[12.5px] text-[var(--muted-foreground)]">
        Every new job
      </p>
    );
  }

  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {parts.map((p) => (
        <span
          key={p}
          className="rounded-md bg-[var(--muted)] px-2 py-1 text-[11.5px] font-medium text-[var(--muted-foreground)]"
        >
          {p}
        </span>
      ))}
    </div>
  );
}

/** 27821234567 -> 082 123 4567, which is how people read their own number. */
function formatNumber(e164: string): string {
  const local = e164.startsWith("27") ? `0${e164.slice(2)}` : e164;
  return local.replace(/^(\d{3})(\d{3})(\d{4})$/, "$1 $2 $3");
}
