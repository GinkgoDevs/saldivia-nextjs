"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { buttonClass } from "@/app/components/ui/Button";

const nav = [
  { href: "/dashboard", label: "Inicio" },
  { href: "/dashboard/models", label: "Modelos" },
  { href: "/dashboard/locations", label: "Ubicaciones" },
  { href: "/dashboard/province-projects", label: "Mapa prov." },
];

export function DashboardFrame({
  email,
  children,
}: {
  email?: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/dashboard/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-surface font-headline text-on-surface">
      <div className="border-b border-outline-variant/35 bg-surface-container-lowest">
        <div className="mx-auto flex max-w-screen-2xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary">Saldivia</p>
            <p className="text-sm text-on-surface-variant">{email ?? "Sesión"}</p>
          </div>
          <nav className="flex flex-wrap gap-2">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={buttonClass({
                    variant: active ? "secondary" : "ghost",
                    size: "sm",
                    className: "min-h-10",
                  })}
                >
                  {item.label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => void signOut()}
              className={buttonClass({ variant: "outline", size: "sm" })}
            >
              Salir
            </button>
          </nav>
        </div>
      </div>
      {children}
    </div>
  );
}
