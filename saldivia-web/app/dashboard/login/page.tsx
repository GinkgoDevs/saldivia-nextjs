import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col justify-center px-6 py-16 font-headline md:px-8">
      <div className="rounded-sm border border-outline-variant/40 bg-surface-container-lowest p-8 shadow-[0px_12px_32px_rgba(13,44,79,0.08)] md:p-10">
        <span className="mb-3 block text-xs font-bold uppercase tracking-[0.25em] text-secondary">
          Acceso interno
        </span>
        <h1 className="text-2xl font-black uppercase tracking-tighter text-primary md:text-3xl">
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
