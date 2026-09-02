/**
 * A company avatar built from the company's own name.
 *
 * Deliberately not a favicon lookup. Most listings on this board come from
 * recruiters whose domain can't be guessed from their name, and a third-party
 * icon service is a dependency that can hang, get blocked, quietly return a
 * grey placeholder, or leak which employers a user is browsing. Initials
 * always render, instantly, and read as intentional rather than broken.
 */

function initials(company: string): string {
  const words = company
    .trim()
    .split(/\s+/)
    // Skip the corporate suffixes — "Pty", "Ltd" make for useless initials.
    .filter((w) => /[a-z0-9]/i.test(w))
    .filter((w) => !/^(pty|ltd|llc|inc|the|and|&)\.?$/i.test(w));

  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

/**
 * A stable colour per company, so the same employer looks the same everywhere
 * and a long list stays scannable. Hue comes from the name; saturation and
 * lightness are fixed so every swatch carries white text at the same contrast.
 */
function avatarColor(company: string): string {
  let hash = 0;
  for (let i = 0; i < company.length; i++) {
    hash = (hash * 31 + company.charCodeAt(i)) | 0;
  }
  return `hsl(${Math.abs(hash) % 360} 42% 40%)`;
}

type Props = {
  company: string;
  size?: number;
};

export default function CompanyLogo({ company, size = 36 }: Props) {
  return (
    <span
      aria-hidden
      className="grid shrink-0 place-items-center rounded-lg font-semibold tracking-tight text-white"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: avatarColor(company),
      }}
    >
      {initials(company)}
    </span>
  );
}
