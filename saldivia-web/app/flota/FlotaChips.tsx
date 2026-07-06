import Link from "next/link";

import { FLEET_SEGMENTS } from "../data/flota-catalog";
import { buttonClass } from "../components/ui/Button";

const HERO_ACTIVE =
  "border-brand-sky bg-brand-sky text-on-brand-sky shadow-elev-2 hover:brightness-110";

type Props = { activeSegment: string | null };

export function FlotaChips({ activeSegment }: Props) {
  return (
    <div className="mt-8 flex flex-wrap gap-2 sm:mt-10 sm:gap-3">
      <Link
        href="/flota"
        className={buttonClass({
          variant: "on-dark-outline",
          size: "sm",
          className: !activeSegment ? HERO_ACTIVE : undefined,
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
              variant: "on-dark-outline",
              size: "sm",
              className: isActive ? HERO_ACTIVE : undefined,
            })}
          >
            {s.title.replace(/^Segmento\s+/i, "")}
          </Link>
        );
      })}
    </div>
  );
}
