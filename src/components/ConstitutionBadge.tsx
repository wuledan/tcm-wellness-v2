import { constitutions, type Constitution } from "@/data/constitutions";

interface Props {
  constitutionId: string;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
}

export default function ConstitutionBadge({ constitutionId, size = "md", showName = true }: Props) {
  const c = constitutions.find((c) => c.id === constitutionId);
  if (!c) return null;

  const sizeClasses = {
    sm: "text-sm px-2 py-0.5",
    md: "text-base px-3 py-1",
    lg: "text-lg px-4 py-2",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClasses[size]}`}
      style={{ backgroundColor: c.color + "30", color: c.color }}
    >
      <span>{c.emoji}</span>
      {showName && <span>{c.name_zh}</span>}
    </span>
  );
}

export function getConstitutionStyle(constitutionId: string) {
  const c = constitutions.find((c) => c.id === constitutionId);
  if (!c) return { color: "#80B080", bgColor: "#F0F8F0", emoji: "🌿", name_zh: "", name_en: "" };
  return c;
}
