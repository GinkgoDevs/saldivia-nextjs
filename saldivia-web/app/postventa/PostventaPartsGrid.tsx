"use client";

import { StaggerInView, StaggerItem } from "../components/motion";

const parts = [
  { name: "Conjunto Óptico LED", code: "SLD-4452", badge: "Aries 365", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCl_HZ3zzCVkOM0EieXCw54FzYrlpEww6hEURsJX-hVb31L3aPHk0Z0a1DIJbkFrEnbYTaKvxxGG55nb-pZSvGsqA6Nx8Ru8THY1k-roJ4SCuHzwQ7OSRq2GqI_-THL0FmtXWX_b3uQAssDEbvUfqhVxB7klzhZ2zo2aJDVMNBwDOb9Rxt9ufFNodMjsPuhKA4Ssopa5nr5QfqGhttTwHgdOmdFiGa5FZbWcGg5yMk-z2dM_6bZTmRlGxGC3X5FFC5_MqG_bdk0sIGa" },
  { name: "Kit Filtros Motor", code: "SLD-7821", badge: "Euro 6", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDxbpeQg_eswjH_HuZE2ZDYaaZg7lTi4L6Tx5jlR4VcDLJmZtAVqMkX4KAJTmbKMujj_bz80X8K9WbzNPPoyM4e3tJC7THzrA44jyRmqruj_re8D6EDXEfD0QvfKjMU6HSXBTR1X7nNBPuNwxi16tmAm1u9D-uBSGU9Ry0sYQHP0g2NG9gp464unP60YQKd_HNe9CMjqITQZiJW6dhjSt0yCE4HNCrFeChzRG55VPgMRqsaAVoFkMJe2C5ouvLBKthGuyssqs5z2rIQ" },
  { name: "Discos de Freno HD", code: "SLD-2309", badge: "Línea Pesada", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJr72D-321DVvMYHbZO01Hl_hFaX5Y2dJXCN2JcM1oSUfUkeT0UO3r8YrG4Pbi1RLtwYnXGiapDMncZqhfCInjAmj8kFDIkwaY_liodDi2HmX5aNh-e5YA1QzyjhrZz4WMW_TAkxyRKuNjl2g1VCJNKhZ7wnXrS9gUAAocSASrPb2lXXSZwr3bnl8LlpnIn6nVONWkHEwpf5OUuWntbPj3c5Uu0FA5Ep72OPIjvvENIF97J6WQj4JD_vi3QFzFhkE6WS6dow9kAQm" },
  { name: "Amortiguador Neumático", code: "SLD-5561", badge: "Integral", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAuFmcWHwY4bq_t_b7Bx7wXTb6ZMd6fjjOqtHdtSLe5GynEzwX_xnqSZsQ2H_3vw6g37nO08KfDREqkxCWxlFbxZiNbghf3WC8KCaJToIApnAreP1c9afW7dmWganK-7_04a3DLPxjlCJ0EbHjfVvsCT8p4CIXT_NUuQYIY_KIYGfD--qWmvTmBhlMjA1e7oEB4ANIf17BRXwSl9-cJenJXOqDNU8DCWtC893enWMJsiUQRWXcJE5c-v0Tskg_Zu15C7tssPS_WDZhZ" },
] as const;

export function PostventaPartsGrid() {
  return (
    <StaggerInView className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-4" stagger={0.08}>
      {parts.map((part) => (
        <StaggerItem key={part.code} className="group overflow-hidden rounded-lg bg-surface-container-low">
          <div className="h-48 overflow-hidden bg-surface-container-lowest">
            <img
              alt={part.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              src={part.img}
            />
          </div>
          <div className="p-4">
            <div className="mb-2 flex items-start justify-between">
              <h4 className="text-sm font-bold tracking-tight text-primary">{part.name}</h4>
              <span className="bg-primary-fixed px-2 py-1 text-[8px] font-black uppercase text-on-primary-fixed">{part.badge}</span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Código: {part.code}</p>
          </div>
        </StaggerItem>
      ))}
    </StaggerInView>
  );
}
