"use client";

import { useEffect, useState } from "react";

type Props = {
  galleryImages: string[];
};

export default function Aries365Client({ galleryImages }: Props) {
  const [darkMode, setDarkMode] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const n = galleryImages.length;

  useEffect(() => {
    if (n === 0) {
      setActiveImage(0);
      return;
    }
    setActiveImage((i) => Math.min(i, n - 1));
  }, [n]);

  const toggleDark = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className={`bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300`}>
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center">
              <img
                alt="Saldivia Logo"
                className="h-8"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAH9sk2qVlaW2HmqsMj7RGInq860IqTr---AAyFEuPJ8AY6vYBzGhJv0Sh-NCEdqvWu6gBcemcU6igHbMcsbLT2fD5Oplt5ECr95RTC5lXVMru8DCoEg89Hl7nHTTvdAwlmDu79t3G3w4gcmzCsYbmKiSpMULOqBb_pcJs9fgMuDaRsTiSwHzbo3DPwxijNw0yuRX5GyEIqGTydIrKefOaBTHiykO2lDJPZDsWtsyJD5jWByg1AYNCLgGAyK3oUwfXLmnrC5lAwctTC"
              />
            </div>
            <nav className="hidden md:flex space-x-8">
              <a className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium transition-colors" href="/">HOME</a>
              <a className="text-primary font-bold border-b-2 border-primary" href="/flota">PRODUCTOS</a>
              <a className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium transition-colors" href="#">NOSOTROS</a>
              <a className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium transition-colors" href="/contacto">CONTACTO</a>
              <a className="flex items-center text-slate-600 dark:text-slate-300 hover:text-primary font-medium transition-colors" href="/postventa">
                <span className="material-icons-outlined text-sm mr-1">build</span>POSTVENTA
              </a>
            </nav>
            <div className="flex items-center gap-4">
              <button
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                onClick={toggleDark}
              >
                {darkMode ? (
                  <span className="material-icons-outlined">light_mode</span>
                ) : (
                  <span className="material-icons-outlined">dark_mode</span>
                )}
              </button>
              <a className="bg-primary text-white px-5 py-2.5 rounded font-semibold text-sm hover:opacity-90 transition-opacity" href="/contacto">
                COTIZAR
              </a>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero / Gallery */}
        <section className="bg-white dark:bg-slate-900 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex text-sm mb-6 text-slate-500 dark:text-slate-400">
              <a className="hover:text-primary" href="/flota">Productos</a>
              <span className="mx-2">/</span>
              <a className="hover:text-primary" href="/flota#interprovincial">Larga Distancia</a>
              <span className="mx-2">/</span>
              <span className="text-slate-800 dark:text-white font-semibold">Aries 365 / 1200</span>
            </nav>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-4">
                <div className="aspect-[16/9] bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden relative group">
                  {n > 0 ? (
                    <img
                      alt={`Saldivia Aries 365 — imagen ${activeImage + 1} de ${n}`}
                      className="w-full h-full object-cover"
                      src={galleryImages[activeImage]}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center px-6 text-center text-sm text-slate-500 dark:text-slate-400">
                      No hay imágenes en <code className="mx-1 rounded bg-slate-200 px-1 dark:bg-slate-700">public/ARIES-305</code>
                    </div>
                  )}
                  {n > 0 ? (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-8 pointer-events-none">
                      <span className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium">
                        {activeImage + 1} / {n}
                      </span>
                    </div>
                  ) : null}
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                  {galleryImages.map((src, index) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      className={`aspect-square rounded-xl overflow-hidden transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
                        index === activeImage
                          ? "ring-2 ring-primary border-2 border-primary"
                          : "border-2 border-transparent hover:opacity-85"
                      }`}
                      aria-label={`Ver imagen ${index + 1}`}
                      aria-current={index === activeImage ? "true" : undefined}
                    >
                      <img
                        alt=""
                        className="w-full h-full object-cover"
                        src={src}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 space-y-8">
                <div>
                  <h1 className="text-4xl lg:text-5xl font-display font-extrabold text-slate-900 dark:text-white leading-tight">
                    Aries 365 <br /><span className="text-primary">1200 Series</span>
                  </h1>
                  <p className="mt-4 text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                    Redefiniendo el estándar de transporte interurbano con aerodinámica avanzada y confort inigualable. Diseñado para maximizar la rentabilidad del operador.
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  <a
                    className="flex items-center justify-center gap-2 bg-primary text-white py-4 px-6 rounded-xl font-bold text-lg hover:brightness-110 transition-all shadow-lg shadow-primary/25"
                    href="#"
                  >
                    <span className="material-icons-outlined">picture_as_pdf</span>
                    Descargar Ficha Técnica
                  </a>
                  <a
                    className="flex items-center justify-center gap-2 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-4 px-6 rounded-xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                    href="#contact"
                  >
                    Solicitar Presupuesto
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sub-nav */}
        <nav className="sticky top-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8 overflow-x-auto no-scrollbar py-4">
              <a className="whitespace-nowrap font-semibold text-primary border-b-2 border-primary pb-4 -mb-4 transition-all" href="#overview">Descripción</a>
              <a className="whitespace-nowrap font-medium text-slate-500 dark:text-slate-400 hover:text-primary transition-colors pb-4 -mb-4" href="#technical">Ficha Técnica</a>
              <a className="whitespace-nowrap font-medium text-slate-500 dark:text-slate-400 hover:text-primary transition-colors pb-4 -mb-4" href="#configs">Configuraciones</a>
              <a className="whitespace-nowrap font-medium text-slate-500 dark:text-slate-400 hover:text-primary transition-colors pb-4 -mb-4" href="#downloads">Descargas</a>
            </div>
          </div>
        </nav>

        {/* Overview */}
        <section className="py-24 scroll-mt-nav" id="overview">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-display font-bold mb-4">Excelencia en Ingeniería</h2>
              <p className="text-slate-600 dark:text-slate-400">
                Cada detalle del Aries 365 ha sido proyectado para ofrecer la máxima eficiencia operativa y seguridad estructural.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: "settings_input_component", title: "Chasis Universal", desc: "Compatible con Mercedes-Benz, Scania, Volvo e Iveco." },
                { icon: "airline_seat_recline_extra", title: "Capacidad", desc: "Hasta 50 pasajeros en configuración Semi-Cama." },
                { icon: "security", title: "Seguridad Activa", desc: "Cumple con normativas R66 y sistemas anti-vuelco." },
                { icon: "air", title: "Aerodinámica", desc: "CX optimizado para reducir el consumo de combustible." },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:border-primary transition-all group"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                    <span className="material-icons-outlined">{item.icon}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technical Specs */}
        <section className="py-24 bg-slate-50 dark:bg-slate-900/50 scroll-mt-nav" id="technical">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl border border-slate-100 dark:border-slate-700">
              <div className="p-8 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <h2 className="text-2xl font-display font-bold">Especificaciones Técnicas</h2>
                <button className="text-primary font-bold flex items-center gap-1 text-sm">
                  <span className="material-icons-outlined text-sm">file_download</span> PDF COMPLETO
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {[
                      ["Longitud Total", "13.200 mm - 14.000 mm"],
                      ["Ancho Exterior", "2.600 mm"],
                      ["Altura Interior", "1.930 mm"],
                      ["Sistema de Aire Acondicionado", "Climatización inteligente con control bizona"],
                      ["Iluminación", "LED Full Exterior / Interior ambiental regulable"],
                      ["Bodegas", "9.5 m³ a 12 m³ de capacidad"],
                    ].map(([label, value]) => (
                      <tr key={label} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <td className="px-8 py-5 font-semibold text-slate-500 dark:text-slate-400 w-1/3">{label}</td>
                        <td className="px-8 py-5 font-medium">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-24 scroll-mt-nav" id="contact">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-display font-bold mb-6">¿Interesado en el Aries 365?</h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 leading-relaxed">
                  Nuestro equipo comercial está listo para asesorarte sobre la mejor configuración para tu flota y las opciones de financiación disponibles.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-icons-outlined">phone</span>
                    </div>
                    <span className="font-semibold text-lg">+54 341 456-7890</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-icons-outlined">email</span>
                    </div>
                    <span className="font-semibold text-lg">ventas@saldivia.com.ar</span>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-slate-600 dark:text-slate-300">Nombre</label>
                      <input
                        className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary transition-all"
                        placeholder="Tu nombre"
                        type="text"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-slate-600 dark:text-slate-300">Empresa</label>
                      <input
                        className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary transition-all"
                        placeholder="Nombre de empresa"
                        type="text"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-600 dark:text-slate-300">Correo Electrónico</label>
                    <input
                      className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary transition-all"
                      placeholder="email@ejemplo.com"
                      type="email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-600 dark:text-slate-300">Mensaje</label>
                    <textarea
                      className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary transition-all"
                      placeholder="Estoy interesado en..."
                      rows={4}
                    />
                  </div>
                  <button
                    className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:brightness-110 transition-all shadow-lg shadow-primary/25"
                    type="submit"
                  >
                    ENVIAR CONSULTA
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Related Models */}
        <section className="py-24 bg-slate-100 dark:bg-slate-900/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-display font-bold mb-2">Otros Modelos Relacionados</h2>
                <p className="text-slate-500 dark:text-slate-400">Explora nuestra gama completa de soluciones.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Aries 405 / 1400",
                  subtitle: "Interurbano Premium",
                  src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6qvSoQWGPXO2IcoCLWeF8sCNjxjttn47WNdeM3E_X0RuGUUTE0AS1ZgwlAcjmYgBFWOAk2WszoeRh0GLlUg4pPwHQ-Jl1wD3hFYMT8uZbsPTLsGYXwAAR_pP1LKfhkslo9sEfyDNgxTaa-Q0LVNLzS37CHn0FUZPF9r3tLB0tR6N667z8nksh0k-_--zi_W3nFdkNq7eP3GE9jc97eY3aEguHcBUFU-3w0By8Dm-TJeuQWxRrBxA-VV2Sau_8P15UaxRC84pok3ZH",
                },
                {
                  title: "Cisne Urbano",
                  subtitle: "Solución Urbana Eficiente",
                  src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAqProtiCR8q8g06lulp8HiWcKDE-PlWaSDfP1YJJba59a2hzgmxrx8o348XiJtdp9Mt622CoGf6VNKGNwUaPqBHfRWbbKbKXv8t4nvKFlcQRA5UrVSjHvISkFbfi6NU8oQ4Iv0P4VIjfX1s1b2AZrqH05YidRy0kUeYeFbpdz_z1JozlbEa8dHbIEpRgUMMGNVPdcMslvUtPTzrr6s10VjoUNUOM5zQknu1rlUtz6NS2E_QhIi3kYt8HpOZvxT6vE_zCpTSj95iwIJ",
                },
                {
                  title: "Aries Low Entry",
                  subtitle: "Máxima Accesibilidad",
                  src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMkZ9dkXGbFISmjW8Vkcws6RFc4Ot9yE0KET-4KwT1Hgt4M5Ttk9CXq5A8yIVHnvlKAmkXFj5T8kvUMX8bDHetHPE9rmA6JY-Iwb3KCop2aJ5jQLVzida0Kkx401guDEVrYD7HzUwzH5f30xwOZrO3JJWk73v4SxOVj63kHWn9Gew34FMKmxOtNLWdVOC1BPdvYdmZ1PvYt9EfVSgqgerXYjNm6rJ_5YtGoHBKy7FMgb74jao8F4Kwj5xI88PmONBzKKctzSNMdG6J",
                },
              ].map((model) => (
                <div key={model.title} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg group">
                  <div className="aspect-video overflow-hidden">
                    <img
                      alt={model.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      src={model.src}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-1">{model.title}</h3>
                    <p className="text-slate-500 text-sm mb-4">{model.subtitle}</p>
                    <a className="text-primary font-bold flex items-center gap-1" href="/flota">
                      Ver Detalles{" "}
                      <span className="material-icons-outlined text-sm">arrow_forward</span>
                    </a>
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
