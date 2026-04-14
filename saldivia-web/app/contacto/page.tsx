const PLANT_ADDRESS =
  "Parque Industrial Alvear, Ruta 21 Km 7, Alvear, Santa Fe, Argentina";
export default function ContactoPage() {
  const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const embedQuery = encodeURIComponent(PLANT_ADDRESS);
  const mapEmbedSrc = mapsKey
    ? `https://www.google.com/maps/embed/v1/place?key=${mapsKey}&q=${embedQuery}&zoom=15`
    : null;
  const mapsExternalHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(PLANT_ADDRESS)}`;

  return (
    <div className="bg-surface text-on-surface font-headline">
      <main>
        <section className="relative h-[450px] flex items-center overflow-hidden bg-primary-container pt-16">
          <div className="absolute inset-0 z-0">
            <img
              className="w-full h-full object-cover opacity-30 mix-blend-overlay"
              alt="Bus manufacturing facility"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhYxKqaSFEx2SsOSyf72IupxQSTraxx3mVoYdLimkg6EsBaSSN9kbBKtpdDr0oNGTrWJRA08OV7DqUV3XEIbgizHY7IMwE-nheke7fg1f9MnzzR19ctpuzs2bwa2gplghpgiKz2oGmAYppmydPOHjqRSipRZUyr_y7CGyXFSHVzwPsNDG8XwJ85JhexXLQzpelA-5wbk_VHJZF2K3VaSYn6dTQNqJcHW2BWHhgyqu4DeEHlKHBNODwg9JcyjzudtjJA4j7mbcWE_rz"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-container via-primary-container/80 to-transparent"></div>
          </div>
          <div className="container mx-auto px-8 relative z-10">
            <div className="max-w-2xl">
              <span className="text-secondary-container font-label text-machined text-sm font-bold block mb-4">Ingeniería de Clase Mundial</span>
              <h1 className="text-5xl md:text-7xl font-headline font-extrabold text-on-primary tracking-tight mb-6">
                Contáctenos
              </h1>
              <p className="text-lg text-on-primary-container font-headline leading-relaxed max-w-xl">
                Conecte con nuestra planta industrial y equipo comercial. Estamos aquí para impulsar su flota con precisión y eficiencia.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-24 bg-surface">
          <div className="container mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              {/* Left: Direct Channels */}
              <div className="lg:col-span-5 flex flex-col gap-12">
                <div className="space-y-4">
                  <h2 className="text-secondary font-headline text-2xl font-bold">Canales Directos</h2>
                  <p className="text-on-surface-variant font-headline">Póngase en contacto con el departamento específico para una respuesta más ágil.</p>
                </div>
                <div className="grid gap-6">
                  {/* Sales */}
                  <div className="bg-surface-container-low p-8 rounded-lg group transition-all duration-300 hover:bg-surface-container-highest">
                    <div className="flex items-start gap-5">
                      <div className="w-12 h-12 rounded bg-secondary-container flex items-center justify-center text-on-secondary-container">
                        <span className="material-symbols-outlined">shopping_cart</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-machined text-[10px] font-bold text-secondary">Departamento</span>
                        <h3 className="text-xl font-bold text-primary">Ventas Especializadas</h3>
                        <p className="text-on-surface-variant pt-2">ventas@saldivia.com.ar</p>
                        <p className="text-on-surface-variant font-medium">+54 (0341) 492-1234</p>
                      </div>
                    </div>
                  </div>
                  {/* After-Sales */}
                  <div className="bg-surface-container-low p-8 rounded-lg group transition-all duration-300 hover:bg-surface-container-highest">
                    <div className="flex items-start gap-5">
                      <div className="w-12 h-12 rounded bg-secondary-container flex items-center justify-center text-on-secondary-container">
                        <span className="material-symbols-outlined">build</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-machined text-[10px] font-bold text-secondary">Mantenimiento</span>
                        <h3 className="text-xl font-bold text-primary">Postventa &amp; Repuestos</h3>
                        <p className="text-on-surface-variant pt-2">postventa@saldivia.com.ar</p>
                        <p className="text-on-surface-variant font-medium">+54 (0341) 492-5678</p>
                      </div>
                    </div>
                  </div>
                  {/* Admin */}
                  <div className="bg-surface-container-low p-8 rounded-lg group transition-all duration-300 hover:bg-surface-container-highest">
                    <div className="flex items-start gap-5">
                      <div className="w-12 h-12 rounded bg-secondary-container flex items-center justify-center text-on-secondary-container">
                        <span className="material-symbols-outlined">corporate_fare</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-machined text-[10px] font-bold text-secondary">General</span>
                        <h3 className="text-xl font-bold text-primary">Administración Central</h3>
                        <p className="text-on-surface-variant pt-2">info@saldivia.com.ar</p>
                        <p className="text-on-surface-variant font-medium">+54 (0341) 492-0000</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Form */}
              <div className="lg:col-span-7">
                <div className="bg-surface-container-lowest p-8 md:p-12 rounded-lg shadow-[0px_12px_32px_rgba(13,44,79,0.08)]">
                  <h3 className="text-3xl font-headline font-bold text-primary mb-2">Envíenos un mensaje</h3>
                  <p className="text-on-surface-variant mb-10">Complete el formulario y un asesor técnico lo contactará a la brevedad.</p>
                  <form className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-machined text-[11px] font-bold text-secondary">Nombre Completo</label>
                        <input className="w-full bg-surface-variant border-none rounded p-4 focus:ring-2 focus:ring-secondary focus:bg-surface-container-lowest transition-all duration-200 outline-none" placeholder="Ej: Juan Pérez" type="text" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-machined text-[11px] font-bold text-secondary">Empresa</label>
                        <input className="w-full bg-surface-variant border-none rounded p-4 focus:ring-2 focus:ring-secondary focus:bg-surface-container-lowest transition-all duration-200 outline-none" placeholder="Transporte del Sol" type="text" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-machined text-[11px] font-bold text-secondary">Correo Electrónico</label>
                      <input className="w-full bg-surface-variant border-none rounded p-4 focus:ring-2 focus:ring-secondary focus:bg-surface-container-lowest transition-all duration-200 outline-none" placeholder="email@empresa.com" type="email" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-machined text-[11px] font-bold text-secondary">Mensaje o Consulta</label>
                      <textarea className="w-full bg-surface-variant border-none rounded p-4 focus:ring-2 focus:ring-secondary focus:bg-surface-container-lowest transition-all duration-200 outline-none resize-none" placeholder="¿En qué podemos ayudarlo?" rows={5}></textarea>
                    </div>
                    <button className="w-full bg-secondary text-on-secondary py-5 rounded font-bold text-machined tracking-widest hover:opacity-90 transition-all duration-300 active:scale-[0.98]" type="submit">
                      Enviar consulta técnica
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Location Section */}
        <section className="bg-surface-container-low pt-24">
          <div className="container mx-auto px-8">
            <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
              <div className="space-y-4">
                <span className="text-secondary font-label text-machined text-sm font-bold">Ubicación Estratégica</span>
                <h2 className="text-4xl font-headline font-bold text-primary">Planta Industrial Alvear</h2>
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-secondary">location_on</span>
                  <p className="font-headline">{PLANT_ADDRESS}.</p>
                </div>
              </div>
              <a className="text-secondary font-bold text-machined text-sm flex items-center gap-2 group border-b-2 border-transparent hover:border-secondary transition-all" href={mapsExternalHref} target="_blank" rel="noopener noreferrer">
                Ver en Google Maps
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
              </a>
            </div>
          </div>
          <div className="w-full h-[500px] relative overflow-hidden rounded-t-lg bg-surface-container-highest">
            {mapEmbedSrc ? (
              <iframe
                title="Ubicación Planta Industrial Alvear en Google Maps"
                className="absolute inset-0 w-full h-full border-0"
                src={mapEmbedSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl text-secondary">map</span>
                <p className="font-headline max-w-md">
                  Configurá <code className="text-sm bg-surface-container-low px-2 py-0.5 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> en{" "}
                  <code className="text-sm bg-surface-container-low px-2 py-0.5 rounded">.env.local</code> para mostrar el mapa.
                </p>
                <a
                  className="text-secondary font-bold text-machined text-sm underline"
                  href={mapsExternalHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Abrir en Google Maps
                </a>
              </div>
            )}
            <div className="pointer-events-none absolute bottom-4 right-4 flex flex-wrap justify-end gap-2">
              <div className="bg-secondary-container text-on-secondary-container px-4 py-2 rounded text-xs font-bold text-machined shadow-md">
                -32.9597, -60.6393
              </div>
              <div className="bg-secondary-container text-on-secondary-container px-4 py-2 rounded text-xs font-bold text-machined shadow-md">
                S 21 KM 7
              </div>
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="py-16 bg-primary text-on-primary">
          <div className="container mx-auto px-8 flex flex-wrap justify-center gap-16 opacity-60">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-4xl">verified</span>
              <span className="text-machined text-xs font-bold">Certificación ISO 9001</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-4xl">workspace_premium</span>
              <span className="text-machined text-xs font-bold">Calidad de Exportación</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-4xl">high_quality</span>
              <span className="text-machined text-xs font-bold">Ingeniería Certificada</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
