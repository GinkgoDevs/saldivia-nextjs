import Link from "next/link";
import { buttonClass } from "@/app/components/ui/Button";

export function DashboardBackLink() {
  return (
    <p className="mb-6">
      <Link
        href="/dashboard"
        className={buttonClass({
          variant: "ghost",
          size: "sm",
          className: "inline-flex items-center gap-2",
        })}
      >
        <span className="material-symbols-outlined text-[1.25rem] leading-none">arrow_back</span>
        Volver al panel
      </Link>
    </p>
  );
}
