export type ParsedJobUrl = {
  company?: string;
  role?: string;
  link?: string;
};

function toTitleCaseFromSlug(value: string): string {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function cleanPathSegments(pathname: string): string[] {
  return pathname.split("/").map((segment) => segment.trim()).filter(Boolean);
}

export function parseJobUrl(rawUrl: string): ParsedJobUrl | null {
  const trimmed = rawUrl.trim();

  if (!trimmed) {
    return null;
  }

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  const host = url.hostname.toLowerCase();
  const segments = cleanPathSegments(url.pathname);
  const parsed: ParsedJobUrl = { link: url.toString() };

  const looksLikeGreenhouse = host.includes("greenhouse.io");
  const looksLikeLever = host.includes("lever.co");
  const looksLikeLinkedIn = host.includes("linkedin.com");

  if (looksLikeGreenhouse) {
    // Typical pattern: boards.greenhouse.io/<company>/jobs/<id>
    if (segments.length >= 2) {
      parsed.company = toTitleCaseFromSlug(segments[0]);
    }

    if (segments.length >= 3 && segments[1] !== "jobs") {
      parsed.role = toTitleCaseFromSlug(segments[1]);
    }
  }

  if (looksLikeLever) {
    // Typical pattern: jobs.lever.co/<company>/<role-slug>
    if (segments.length >= 1) {
      parsed.company = toTitleCaseFromSlug(segments[0]);
    }
    if (segments.length >= 2) {
      parsed.role = toTitleCaseFromSlug(segments[1]);
    }
  }

  if (looksLikeLinkedIn) {
    // LinkedIn URLs rarely contain a reliable role/company slug.
    // We still preserve the link and let users type only missing fields.
    if (segments[0] === "jobs" && segments[1] === "view") {
      parsed.role = undefined;
    }
  }

  return parsed;
}
