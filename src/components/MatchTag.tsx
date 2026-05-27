import { matchLevelConfig, type MatchLevel } from "@/data/foods";

interface Props {
  level: MatchLevel;
  showLabel?: boolean;
}

export default function MatchTag({ level, showLabel = true }: Props) {
  const config = matchLevelConfig[level];

  return (
    <span className="inline-flex items-center gap-1 text-sm font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: config.color + "20", color: config.color }}>
      <span>{config.emoji}</span>
      {showLabel && <span>{config.label_zh}</span>}
    </span>
  );
}
