export default function NosotrosPage() {
  return (
    <div className="bg-surface text-on-surface font-headline">
      <main>
        <section className="relative h-[614px] flex items-center overflow-hidden asymmetric-gradient pt-16">
          <div className="absolute inset-0 opacity-40 mix-blend-overlay">
            <img
              className="w-full h-full object-cover"
              alt="Modern high-tech bus factory"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDy_GWM56dioRQctR5tYKjjSo_grPjzDOsD4QnxY6euQderK2_vK08JC-oc-GGiokQpNdZFzGdQ31ks3ucE_AmwKv6FJM08wiUS3z2FnHfPKNIBTjfKpykewj557aUsk67Z9J-V7hOKuneG7_mN11dMjd1zifKtA4u0baRkfhMtXQyD8VMMRiOhqhlYV1BCkAEoeqnAekz9wo62xMYCHIl5wNa-VDnO0qh08nDKu6NxGIPXiklT9yrLDGfhlECI8fzN2fCLJ3FSoLMt"
            />
          </div>
          <div className="relative z-10 px-12 max-w-5xl">
            <span className="text-secondary-container font-bold tracking-[0.2em] uppercase text-sm block mb-4">Nuestra Trayectoria</span>
            <h1 className="text-white text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-none">
              DÉCADAS DE<br /><span className="text-secondary-container">PRECISIÓN</span>
            </h1>
            <p className="text-on-primary-container max-w-xl text-lg font-medium leading-relaxed">
              Desde nuestros orígenes industriales hasta convertirnos en referentes del transporte regional, cada kilómetro recorrido es testimonio de ingeniería y compromiso.
            </p>
          </div>
        </section>

        {/* History Timeline */}
        <section className="py-24 bg-surface relative">
          <div className="container mx-auto px-6">
            <div className="text-center mb-24">
              <h2 className="text-4xl font-black text-primary tracking-tighter uppercase mb-4">Línea de Tiempo Industrial</h2>
              <div className="w-24 h-1 technical-gradient mx-auto"></div>
            </div>
            <div className="relative">
              <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-10 -ml-5 zigzag-line opacity-20"></div>
              <div className="space-y-32">
                {/* 1988 */}
                <div className="flex flex-col lg:flex-row items-center gap-12 group">
                  <div className="lg:w-1/2 order-2 lg:order-1 text-right">
                    <div className="bg-surface-container-low p-8 rounded shadow-sm border-r-4 border-secondary">
                      <span className="text-secondary font-black text-5xl block mb-2">1988</span>
                      <h3 className="text-xl font-bold text-primary uppercase tracking-tight mb-4">EL NACIMIENTO DEL GIGANTE</h3>
                      <p className="text-on-surface-variant leading-relaxed">Fundación de Saldivia como taller especializado en mantenimiento pesado. El inicio de un sueño basado en la robustez estructural.</p>
                      <div className="mt-6 flex gap-2 justify-end">
                        <span className="bg-secondary-container text-on-secondary-container px-3 py-1 text-[10px] font-bold uppercase tracking-tighter">ORIGEN</span>
                        <span className="bg-secondary-container text-on-secondary-container px-3 py-1 text-[10px] font-bold uppercase tracking-tighter">PASIÓN</span>
                      </div>
                    </div>
                  </div>
                  <div className="z-10 bg-primary w-16 h-16 rounded flex items-center justify-center text-white font-black shrink-0 shadow-xl ring-8 ring-surface">
                    <span className="material-symbols-outlined">factory</span>
                  </div>
                  <div className="lg:w-1/2 order-3">
                    <div className="h-64 rounded-lg overflow-hidden grayscale hover:grayscale-0 transition-all duration-500 shadow-2xl">
                      <img
                        className="w-full h-full object-cover"
                        alt="Industrial workshop 1988"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUhz9LWXaVud5PgInl9OtqbGeOwEoNB1vcTPQ8MNejdXm1GK7niy2OyQRQ85yueYFGfchvxtLzwCHvzZlZQzFZLD7-zVA6trRFq50kxcYtL4kBNQHMgwjDKqkNPmAvJsc-tCFiEwPMyTSSac0t4Qc3zE_EIo354wRIE-YTcgF1i9rn_ERcPSHGetZbetiC2zL-ckZncIDR7p-xtu0RguPPl5x0qOrAtJ5TNCBRDVBo2KOhndp2Qb2Uj4Y139RyeeVMlMZJ6IM7VJpF"
                      />
                    </div>
                  </div>
                </div>

                {/* 2005 */}
                <div className="flex flex-col lg:flex-row items-center gap-12 group">
                  <div className="lg:w-1/2 order-3 lg:order-1">
                    <div className="h-64 rounded-lg overflow-hidden grayscale hover:grayscale-0 transition-all duration-500 shadow-2xl">
                      <img
                        className="w-full h-full object-cover"
                        alt="Engineering 2005"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDliWzV3M-UWKH5-1ss4GfBt-T2JaTVHdyQeNz59G_dbJxk2xkb6d1mZlKc1_SP-eXo2_W0vXldYKO0Q63hc_4M22KoC2AuZXog_l3gZidh2S0te39iilEdgXvdPDPi87NL2M81gnvxM_zbypAdn8wTivHeh9fYznw3ED-lAXmAtYT9i08wREhX2RkBoE8XKjT1E7VpJg5NpxSojND74u4BwceTLllKexXclnoD1oliKElkhwNAhH9OiIfWDm9K4rE8KPXXsVuijX9V"
                      />
                    </div>
                  </div>
                  <div className="z-10 bg-secondary w-16 h-16 rounded flex items-center justify-center text-white font-black shrink-0 shadow-xl ring-8 ring-surface">
                    <span className="material-symbols-outlined">precision_manufacturing</span>
                  </div>
                  <div className="lg:w-1/2 order-2 text-left">
                    <div className="bg-surface-container-low p-8 rounded shadow-sm border-l-4 border-secondary">
                      <span className="text-secondary font-black text-5xl block mb-2">2005</span>
                      <h3 className="text-xl font-bold text-primary uppercase tracking-tight mb-4">INGENIERÍA PROPIA</h3>
                      <p className="text-on-surface-variant leading-relaxed">Presentación del primer chasis desarrollado íntegramente por Saldivia. Marcamos el inicio de una era de independencia tecnológica.</p>
                      <div className="mt-6 flex gap-2">
                        <span className="bg-secondary-container text-on-secondary-container px-3 py-1 text-[10px] font-bold uppercase tracking-tighter">CHASIS</span>
                        <span className="bg-secondary-container text-on-secondary-container px-3 py-1 text-[10px] font-bold uppercase tracking-tighter">INNOVACIÓN</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2015 */}
                <div className="flex flex-col lg:flex-row items-center gap-12 group">
                  <div className="lg:w-1/2 order-2 lg:order-1 text-right">
                    <div className="bg-surface-container-low p-8 rounded shadow-sm border-r-4 border-secondary">
                      <span className="text-secondary font-black text-5xl block mb-2">2015</span>
                      <h3 className="text-xl font-bold text-primary uppercase tracking-tight mb-4">LIDERAZGO REGIONAL</h3>
                      <p className="text-on-surface-variant leading-relaxed">Expansión de la planta industrial a 25,000m². Saldivia se posiciona como el carrocero líder en soluciones personalizadas.</p>
                      <div className="mt-6 flex gap-2 justify-end">
                        <span className="bg-secondary-container text-on-secondary-container px-3 py-1 text-[10px] font-bold uppercase tracking-tighter">CRECIMIENTO</span>
                        <span className="bg-secondary-container text-on-secondary-container px-3 py-1 text-[10px] font-bold uppercase tracking-tighter">CAPACIDAD</span>
                      </div>
                    </div>
                  </div>
                  <div className="z-10 bg-primary w-16 h-16 rounded flex items-center justify-center text-white font-black shrink-0 shadow-xl ring-8 ring-surface">
                    <span className="material-symbols-outlined">public</span>
                  </div>
                  <div className="lg:w-1/2 order-3">
                    <div className="h-64 rounded-lg overflow-hidden grayscale hover:grayscale-0 transition-all duration-500 shadow-2xl">
                      <img
                        className="w-full h-full object-cover"
                        alt="Fleet expansion 2015"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiTFG7DhNGyoDqVv6EBvMzw_ImM8oYQZVvZNBxoEwuiBYLD-0C3kb25UwxAErLnyPoce4eHmZItnT2MFLnkGCkN3nrNIAB-G67LKqX3KX-v7Atjf1MVTyLLVnHoEaSeWQD4bULHjUNBtun6FaFrd6mUTYuz2CKSGVwkMjoyDfj6HNlPWWGqmoiYHOUsmuq2g_bmgl_hM2qHX--M29E_husSlCr-IuWC-q36W7Cb4sPQTXmJA4R8_zdbEGceRYGDvufSWripCImM5q"
                      />
                    </div>
                  </div>
                </div>

                {/* 2024 */}
                <div className="flex flex-col lg:flex-row items-center gap-12 group">
                  <div className="lg:w-1/2 order-3 lg:order-1">
                    <div className="h-64 rounded-lg overflow-hidden grayscale hover:grayscale-0 transition-all duration-500 shadow-2xl">
                      <img
                        className="w-full h-full object-cover"
                        alt="Smart systems 2024"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOeSF4qyLXEOT_k71T_v1K52ayE4kQASEKIvriTYlHwivddTHVpisPXZ266D7SbPeBndrt6R8jftKMd4sRRzvnsgVb51TCgJWN-yvcaW7uICzMXB7Ztp3b73bJTF826CpA8MZmEZ-vLQ36QXuTznz0W9smFygHbQ-IZWvDEPefzdAYqBAptuanlNoK0qw64Q4AjDlgG1Ak8FCsmjRhujy_QDmNPDv4kXrR6cAV33WE8lDxTP9Q_eoQeBoRmKCeIO3S-d14Uwi33_pz"
                      />
                    </div>
                  </div>
                  <div className="z-10 technical-gradient w-16 h-16 rounded flex items-center justify-center text-white font-black shrink-0 shadow-xl ring-8 ring-surface">
                    <span className="material-symbols-outlined">bolt</span>
                  </div>
                  <div className="lg:w-1/2 order-2 text-left">
                    <div className="bg-surface-container-low p-8 rounded shadow-sm border-l-4 border-secondary">
                      <span className="text-secondary font-black text-5xl block mb-2">2024</span>
                      <h3 className="text-xl font-bold text-primary uppercase tracking-tight mb-4">SISTEMAS INTELIGENTES</h3>
                      <p className="text-on-surface-variant leading-relaxed">Integración de telemetría avanzada y sistemas de asistencia al conductor de última generación. El futuro es digital.</p>
                      <div className="mt-6 flex gap-2">
                        <span className="bg-secondary-container text-on-secondary-container px-3 py-1 text-[10px] font-bold uppercase tracking-tighter">SMART BUS</span>
                        <span className="bg-secondary-container text-on-secondary-container px-3 py-1 text-[10px] font-bold uppercase tracking-tighter">DATOS</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

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
                <button className="mt-8 self-start flex items-center gap-2 text-white font-bold uppercase tracking-widest text-xs hover:text-secondary-container transition-colors">
                  Ver nuestros modelos <span className="material-symbols-outlined">arrow_forward</span>
                </button>
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
