import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center bg-surface px-6 py-16 font-headline md:px-8">
      <div className="rounded-sm border border-outline-variant/40 bg-surface-container-lowest p-8 shadow-elev-1 md:p-10">
        <span className="mb-3 block text-xs font-bold uppercase tracking-[0.25em] text-secondary">
          Acceso interno
        </span>
        <h1 className="text-2xl font-black uppercase tracking-tighter text-on-surface md:text-3xl">
          Iniciar sesión
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-on-surface-variant">
          Ingresá con un usuario creado en Supabase Auth (proyecto de la instancia vinculada a esta web).
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
