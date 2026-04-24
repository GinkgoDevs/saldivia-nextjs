import { getModels } from "@/lib/supabase/models";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { PostventaSoporteForm } from "../components/postventa/PostventaSoporteForm";
import { Button, buttonClass } from "../components/ui/Button";

export default async function PostventaPage() {
  const supabase = await createClient();
  const { data: models } = await getModels(supabase, {});
  const modelOptions = (models ?? []).map((m) => ({ name: m.name, slug: m.slug }));
  return (
    <div className="bg-surface text-on-surface font-headline">
      <main className="min-h-screen">
        <section className="relative h-[400px] flex items-center overflow-hidden pt-16">
          <div className="absolute inset-0 z-0">
            <img
              alt="Technical support facility"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD93K-U-tuqyy5pO_2gimujh3MAeZV1bIYRYw-Ezk4VbGX1XWWZtp0DvmIXli57Sm-WF4Du0cQmRny9_VI7crVJyMY372GchuvTYpI6psWPoeYCsNa6k1zJntrTH0wMtGUhrYgpBWVCLNWXLt6mtf3m3IEohDHT9IJwx9NjGAy-4pqMKtlAfnn573Szbrvm1FCpjKJgyHKnFICTowCeh8w2ifByxHQ78BgwJQlK8fpjIi6_c4XU5lnhdVglTnva13uNtPiRn6FQAXKv"
            />
            <div className="absolute inset-0 machined-gradient opacity-80"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
            <div className="max-w-2xl">
              <span className="inline-block bg-secondary text-white px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase mb-4">Ingeniería en Movimiento</span>
              <h1 className="text-5xl font-extrabold text-white tracking-tighter mb-6 leading-tight">CENTRO DE POSTVENTA Y SOPORTE TÉCNICO</h1>
              {/* <p className="text-on-primary-container text-lg max-w-lg mb-8 leading-relaxed">
                Compromiso de excelencia y precisión industrial para mantener su flota Saldivia operando al máximo rendimiento.
              </p> */}
            </div>
          </div>
        </section>

        {/* Services Cards */}
        <section className="max-w-7xl mx-auto px-8 -mt-16 relative z-20 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { icon: "precision_manufacturing", title: "Repuestos Originales", desc: "Componentes de ingeniería con certificación de fábrica para garantizar durabilidad.", link: "Ver Catálogo" },
              { icon: "build_circle", title: "Soporte Técnico", desc: "Asistencia directa de especialistas en mecánica y electrónica de buses.", link: "Solicitar Ayuda" },
              { icon: "history", title: "Garantía Saldivia", desc: "Información detallada sobre coberturas y procesos de reclamo técnico.", link: "Consultar Cobertura" },
              { icon: "location_on", title: "Red Nacional", desc: "Encuentre su punto de asistencia oficial más cercano en todo el territorio.", link: "Ver Mapa" },
            ].map((item, i) => (
              <div key={i} className={`bg-surface-container-lowest p-8 shadow-[0px_12px_32px_rgba(13,44,79,0.08)] ${i === 0 ? "border-t-4 border-secondary" : ""}`}>
                <span className="material-symbols-outlined text-secondary mb-4 text-3xl block">{item.icon}</span>
                <h3 className="text-primary font-bold text-sm tracking-widest uppercase mb-2">{item.title}</h3>
                <p className="text-on-surface-variant text-sm mb-6">{item.desc}</p>
                <Link
                  className={buttonClass({
                    variant: "link-cta",
                    size: "sm",
                    className: "min-h-0 px-0 py-0 text-secondary hover:text-primary",
                  })}
                  href="/contacto"
                >
                  {item.link} <span className="material-symbols-outlined text-base">arrow_forward</span>
                </Link>
              </div>
            ))}
          </div>

          {/* Form + Sidebar */}
          <div className="mt-24 grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="mb-12">
                <h2 className="text-3xl font-black text-primary tracking-tighter mb-2">SOLICITUD DE ASISTENCIA TÉCNICA</h2>
                <div className="w-12 h-1 bg-secondary"></div>
              </div>
              <PostventaSoporteForm modelOptions={modelOptions} />
            </div>

            <div className="space-y-8">
              <div className="bg-surface-container-high p-8 rounded">
                <h3 className="text-primary font-black text-xl tracking-tighter mb-4">CANALES DIRECTOS</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 machined-gradient flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-white text-xl">phone_in_talk</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Atención 24/7</p>
                      <p className="text-primary font-bold text-lg">+54 0800 222 7253</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 machined-gradient flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Email Corporativo</p>
                      <p className="text-primary font-bold text-lg">postventa@saldivia.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative h-[250px] machined-gradient p-8 overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10 scale-150 translate-x-1/4 -translate-y-1/4">
                  <span className="material-symbols-outlined" style={{ fontSize: '200px' }}>engineering</span>
                </div>
                <div className="relative z-10">
                  <h4 className="text-white font-black text-2xl tracking-tighter mb-4 leading-none">BIBLIOTECA TÉCNICA</h4>
                  <p className="text-on-primary-container text-sm mb-6 leading-relaxed">Acceda a manuales de usuario, esquemas eléctricos y guías de mantenimiento preventivo.</p>
                  <Button
                    className="bg-secondary-container px-6 text-on-secondary-container hover:bg-white"
                    size="sm"
                  >
                    Area de Clientes
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Parts */}
          <div className="mt-24">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black text-primary tracking-tighter mb-2">REPUESTOS DESTACADOS</h2>
                <div className="w-12 h-1 bg-secondary"></div>
              </div>
              <div className="flex gap-2">
                <Button className="h-10 w-10 border-outline-variant p-0" variant="icon" aria-label="Anterior">
                  <span className="material-symbols-outlined">chevron_left</span>
                </Button>
                <Button className="h-10 w-10 border-outline-variant p-0" variant="icon" aria-label="Siguiente">
                  <span className="material-symbols-outlined">chevron_right</span>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: "Conjunto Óptico LED", code: "SLD-4452", badge: "Aries 365", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCl_HZ3zzCVkOM0EieXCw54FzYrlpEww6hEURsJX-hVb31L3aPHk0Z0a1DIJbkFrEnbYTaKvxxGG55nb-pZSvGsqA6Nx8Ru8THY1k-roJ4SCuHzwQ7OSRq2GqI_-THL0FmtXWX_b3uQAssDEbvUfqhVxB7klzhZ2zo2aJDVMNBwDOb9Rxt9ufFNodMjsPuhKA4Ssopa5nr5QfqGhttTwHgdOmdFiGa5FZbWcGg5yMk-z2dM_6bZTmRlGxGC3X5FFC5_MqG_bdk0sIGa" },
                { name: "Kit Filtros Motor", code: "SLD-7821", badge: "Euro 6", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDxbpeQg_eswjH_HuZE2ZDYaaZg7lTi4L6Tx5jlR4VcDLJmZtAVqMkX4KAJTmbKMujj_bz80X8K9WbzNPPoyM4e3tJC7THzrA44jyRmqruj_re8D6EDXEfD0QvfKjMU6HSXBTR1X7nNBPuNwxi16tmAm1u9D-uBSGU9Ry0sYQHP0g2NG9gp464unP60YQKd_HNe9CMjqITQZiJW6dhjSt0yCE4HNCrFeChzRG55VPgMRqsaAVoFkMJe2C5ouvLBKthGuyssqs5z2rIQ" },
                { name: "Discos de Freno HD", code: "SLD-2309", badge: "Línea Pesada", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJr72D-321DVvMYHbZO01Hl_hFaX5Y2dJXCN2JcM1oSUfUkeT0UO3r8YrG4Pbi1RLtwYnXGiapDMncZqhfCInjAmj8kFDIkwaY_liodDi2HmX5aNh-e5YA1QzyjhrZz4WMW_TAkxyRKuNjl2g1VCJNKhZ7wnXrS9gUAAocSASrPb2lXXSZwr3bnl8LlpnIn6nVONWkHEwpf5OUuWntbPj3c5Uu0FA5Ep72OPIjvvENIF97J6WQj4JD_vi3QFzFhkE6WS6dow9kAQm" },
                { name: "Amortiguador Neumático", code: "SLD-5561", badge: "Integral", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAuFmcWHwY4bq_t_b7Bx7wXTb6ZMd6fjjOqtHdtSLe5GynEzwX_xnqSZsQ2H_3vw6g37nO08KfDREqkxCWxlFbxZiNbghf3WC8KCaJToIApnAreP1c9afW7dmWganK-7_04a3DLPxjlCJ0EbHjfVvsCT8p4CIXT_NUuQYIY_KIYGfD--qWmvTmBhlMjA1e7oEB4ANIf17BRXwSl9-cJenJXOqDNU8DCWtC893enWMJsiUQRWXcJE5c-v0Tskg_Zu15C7tssPS_WDZhZ" },
              ].map((part) => (
                <div key={part.code} className="group bg-surface-container-low rounded overflow-hidden">
                  <div className="h-48 overflow-hidden bg-white">
                    <img alt={part.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={part.img} />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-primary font-bold text-sm tracking-tight">{part.name}</h4>
                      <span className="bg-primary-fixed text-on-primary-fixed text-[8px] font-black px-2 py-1 uppercase">{part.badge}</span>
                    </div>
                    <p className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest">Código: {part.code}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
