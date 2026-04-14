export default function Footer() {
  return (
    <footer className="bg-primary text-[#faf9fc] w-full border-t border-white/10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-12 py-16 w-full max-w-screen-2xl mx-auto">
        <div className="space-y-6">
          <div className="text-xl font-black text-white">SALDIVIA</div>
          <p className="text-[#c4c6cf] text-sm max-w-xs normal-case font-normal leading-relaxed">
            Líderes en fabricación de carrocerías de alta gama para el transporte de pasajeros. Ingeniería argentina con proyección internacional.
          </p>
          <div className="flex gap-4">
            <a className="text-white hover:text-accent-blue transition-colors" href="#">
              <span className="material-symbols-outlined">social_leaderboard</span>
            </a>
            <a className="text-white hover:text-accent-blue transition-colors" href="#">
              <span className="material-symbols-outlined">photo_camera</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h5 className="font-headline text-sm tracking-wide uppercase font-bold text-white mb-6">Links</h5>
            <ul className="space-y-4">
              <li><a className="text-[#c4c6cf] hover:text-accent-blue transition-colors text-xs font-bold uppercase tracking-wider" href="/flota">Modelos</a></li>
              <li><a className="text-[#c4c6cf] hover:text-accent-blue transition-colors text-xs font-bold uppercase tracking-wider" href="#">Tecnología</a></li>
              <li><a className="text-[#c4c6cf] hover:text-accent-blue transition-colors text-xs font-bold uppercase tracking-wider" href="/nosotros">Nosotros</a></li>
              <li><a className="text-[#c4c6cf] hover:text-accent-blue transition-colors text-xs font-bold uppercase tracking-wider" href="/postventa">Postventa</a></li>
              <li><a className="text-[#c4c6cf] hover:text-accent-blue transition-colors text-xs font-bold uppercase tracking-wider" href="/contacto">Contacto</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-headline text-sm tracking-wide uppercase font-bold text-white mb-6">Legal</h5>
            <ul className="space-y-4">
              <li><a className="text-[#c4c6cf] hover:text-accent-blue transition-colors text-xs font-bold uppercase tracking-wider" href="#">Privacidad</a></li>
              <li><a className="text-[#c4c6cf] hover:text-accent-blue transition-colors text-xs font-bold uppercase tracking-wider" href="#">Términos</a></li>
              <li><a className="text-[#c4c6cf] hover:text-accent-blue transition-colors text-xs font-bold uppercase tracking-wider" href="#">Soporte</a></li>
              <li><a className="text-[#c4c6cf] hover:text-accent-blue transition-colors text-xs font-bold uppercase tracking-wider" href="#">Distribuidores</a></li>
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <h5 className="font-headline text-sm tracking-wide uppercase font-bold text-white mb-6">Newsletter</h5>
          <div className="flex gap-2">
            <input
              className="bg-white/10 border-none text-white px-4 py-3 rounded w-full focus:ring-2 focus:ring-accent-blue outline-none placeholder-white/40"
              placeholder="Tu Email"
              type="email"
            />
            <button className="bg-accent-blue text-white px-4 rounded hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-12 py-8 border-t border-white/10 text-center">
        <p className="font-headline text-xs tracking-widest uppercase font-bold text-[#c4c6cf]">
          © 2024 Saldivia Buses. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
