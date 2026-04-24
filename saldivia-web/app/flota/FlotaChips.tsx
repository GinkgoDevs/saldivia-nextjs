import Link from "next/link";

import { FLEET_SEGMENTS } from "../data/flota-catalog";
import { buttonClass } from "../components/ui/Button";

const HERO_INACTIVE =
  "border-white/25 bg-white/5 text-white backdrop-blur-sm hover:border-secondary-container/60 hover:bg-white/10 hover:text-white dark:border-white/20 dark:text-white";
const HERO_ACTIVE =
  "border-secondary-container bg-secondary-container text-primary shadow-elev-2 hover:opacity-95 dark:text-primary";

type Props = { activeSegment: string | null };

export function FlotaChips({ activeSegment }: Props) {
  return (
    <div className="mt-10 flex flex-wrap gap-3">
      <Link
        href="/flota"
        className={buttonClass({
          variant: "outline",
          size: "sm",
          className: !activeSegment ? HERO_ACTIVE : HERO_INACTIVE,
        })}
      >
        Todos
      </Link>
      {FLEET_SEGMENTS.map((s) => {
        const isActive = activeSegment === s.id;
        return (
          <Link
            key={s.id}
            href={`/flota?segment=${s.id}#${s.id}`}
            className={buttonClass({
              variant: "outline",
              size: "sm",
              className: isActive ? HERO_ACTIVE : HERO_INACTIVE,
            })}
          >
            {s.title.replace(/^Segmento\s+/i, "")}
          </Link>
        );
      })}
    </div>
  );
}
