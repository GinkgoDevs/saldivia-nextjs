import Link from "next/link";
import { buttonClass } from "../components/ui/Button";

export default function NosotrosPage() {
  return (
    <div className="bg-surface text-on-surface font-headline">
      <main>
        <section className="relative flex min-h-[420px] items-center overflow-hidden asymmetric-gradient pt-16 md:min-h-[480px]">
          <div className="absolute inset-0 opacity-40 mix-blend-overlay">
            <img
              className="w-full h-full object-cover"
              alt="Modern high-tech bus factory"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDy_GWM56dioRQctR5tYKjjSo_grPjzDOsD4QnxY6euQderK2_vK08JC-oc-GGiokQpNdZFzGdQ31ks3ucE_AmwKv6FJM08wiUS3z2FnHfPKNIBTjfKpykewj557aUsk67Z9J-V7hOKuneG7_mN11dMjd1zifKtA4u0baRkfhMtXQyD8VMMRiOhqhlYV1BCkAEoeqnAekz9wo62xMYCHIl5wNa-VDnO0qh08nDKu6NxGIPXiklT9yrLDGfhlECI8fzN2fCLJ3FSoLMt"
            />
          </div>
          <div className="relative z-10 mx-auto w-full max-w-screen-2xl px-6 md:px-8">
            <span className="mb-4 block text-xs font-bold uppercase tracking-[0.3em] text-secondary-container">Nuestra Trayectoria</span>
            <h1 className="max-w-4xl text-4xl font-black uppercase leading-[0.95] tracking-tighter text-white md:text-6xl lg:text-7xl">
              DÉCADAS DE<br /><span className="text-secondary-container">PRECISIÓN</span>
            </h1>
            <p className="mt-8 max-w-2xl text-base font-medium leading-relaxed text-on-primary-container md:text-lg">
              Desde nuestros orígenes industriales hasta convertirnos en referentes del transporte regional, cada kilómetro recorrido es testimonio de ingeniería y compromiso.
            </p>
          </div>
        </section>

        <NosotrosTimeline />

        {/* Stats Bento Grid */}
        <section className="py-24 bg-surface-container-low">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-primary p-12 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4 group-hover:scale-110 transition-transform duration-700">
                  <span className="material-symbols-outlined" style={{ fontSize: '240px' }}>directions_bus</span>
                </div>
                <div className="relative z-10">
                  <h4 className="text-secondary-container font-black uppercase tracking-widest text-sm mb-2">Producción Histórica</h4>
                  <div className="text-7xl font-black text-white tracking-tighter mb-4">+5,000</div>
                  <p className="text-on-primary-container text-lg max-w-sm">Unidades fabricadas y rodando por toda la geografía sudamericana, garantizando seguridad y confort.</p>
                </div>
                <Link
                  className={buttonClass({
                    variant: "link-cta",
                    size: "sm",
                    className: "mt-8 self-start min-h-0 px-0 py-0 text-white hover:text-secondary-container",
                  })}
                  href="/flota"
                >
                  Ver nuestros modelos <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
              </div>
              <div className="bg-surface-container-highest p-8 flex flex-col justify-center border-t-4 border-secondary">
                <span className="material-symbols-outlined text-secondary text-4xl mb-4">groups</span>
                <div className="text-4xl font-black text-primary tracking-tighter mb-1">450+</div>
                <p className="text-on-surface-variant text-sm font-bold uppercase tracking-wider">Expertos Industriales</p>
              </div>
              <div className="bg-surface-container-highest p-8 flex flex-col justify-center border-t-4 border-secondary">
                <span className="material-symbols-outlined text-secondary text-4xl mb-4">military_tech</span>
                <div className="text-4xl font-black text-primary tracking-tighter mb-1">12</div>
                <p className="text-on-surface-variant text-sm font-bold uppercase tracking-wider">Patentes de Diseño</p>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Excellence */}
        <section className="py-24 bg-surface overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2">
                <div className="relative">
                  <div className="absolute -top-12 -left-12 w-64 h-64 technical-gradient opacity-10 rounded-full blur-3xl"></div>
                  <h2 className="text-5xl font-black text-primary uppercase tracking-tighter leading-tight relative">
                    EL ADN DE <br /><span className="text-secondary">CADA ESTRUCTURA</span>
                  </h2>
                  <p className="mt-8 text-on-surface-variant text-lg leading-relaxed">
                    No solo fabricamos carrocerías; esculpimos piezas de ingeniería que resisten las condiciones más extremas. Nuestra obsesión por el detalle se traduce en longevidad para su flota.
                  </p>
                  <ul className="mt-10 space-y-6">
                    <li className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded bg-secondary-container flex items-center justify-center shrink-0 mt-1">
                        <span className="material-symbols-outlined text-on-secondary-container text-sm">check</span>
                      </div>
                      <div>
                        <p className="text-primary font-bold uppercase text-sm tracking-widest">Aceros de alta resistencia</p>
                        <p className="text-on-surface-variant text-sm">Aleaciones certificadas que optimizan el peso sin comprometer la seguridad.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded bg-secondary-container flex items-center justify-center shrink-0 mt-1">
                        <span className="material-symbols-outlined text-on-secondary-container text-sm">check</span>
                      </div>
                      <div>
                        <p className="text-primary font-bold uppercase text-sm tracking-widest">Aerodinámica computacional</p>
                        <p className="text-on-surface-variant text-sm">Diseños testeados en túneles de viento virtuales para reducir el consumo.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="lg:w-1/2 relative">
                <div className="bg-surface-container-high rounded-xl p-4 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
                  <img
                    className="w-full rounded-lg h-[500px] object-cover"
                    alt="Industrial welding process"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrDFciMzKIDBVpeDSlHAdhQ64TjXYVTPMsFO5nwrejTh-YiKGjy86Jr2ALH03jcOhb7DUWWzgo6wunQ3RuxcUFYS8ENvh_wXE-X9tQ_fsQST0tRMDBy6a4AfvH57CdzEk8r4EZURzfNLrXPKiWxLyN5Yw64JZOOe8ZqJA-1CZFCjqvqyqOlIDlE2e6q-ZLDW7SEMMzdW5SNyihyiDnBzUGRDR2CSJdoj8vgeqz_rh8Vi2o3ulPAtvS0mMD82y_4_sWw4DSXQjZVCZc"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
