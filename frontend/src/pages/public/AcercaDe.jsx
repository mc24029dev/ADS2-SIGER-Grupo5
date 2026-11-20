export default function AcercaDe() {
  return (
    <div className="bg-[#F8FAFC]">
      <section className="max-w-7xl mx-auto px-6 py-20 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        <div>
          <span className="text-[#3B82F6] text-sm font-bold tracking-widest uppercase mb-4 block">Sobre Nosotros</span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Transformando la manera de <span className="text-[#2563EB]">organizar eventos</span>
          </h1>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            SIGER nació como un proyecto informático con un objetivo claro: digitalizar y optimizar la gestión de eventos en instituciones educativas y empresas.
          </p>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Nuestra plataforma elimina el uso de hojas de cálculo y formularios físicos, ofreciendo una experiencia fluida tanto para organizadores como para participantes, con seguridad de nivel empresarial y generación de reportes en tiempo real.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div className="border-l-4 border-[#3B82F6] pl-4">
              <h4 className="font-bold text-gray-900 text-xl">100% Web</h4>
              <p className="text-sm text-gray-500">Accesible desde cualquier dispositivo.</p>
            </div>
            <div className="border-l-4 border-[#3B82F6] pl-4">
              <h4 className="font-bold text-gray-900 text-xl">Seguro</h4>
              <p className="text-sm text-gray-500">Control de acceso basado en roles.</p>
            </div>
          </div>
        </div>

        <div className="relative group perspective">
          <div className="absolute inset-0 bg-[#3B82F6] rounded-2xl transform translate-x-4 translate-y-4 transition-transform group-hover:translate-x-2 group-hover:translate-y-2"></div>
          
          <img 
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop" 
            alt="Equipo organizando evento" 
            className="relative z-10 w-full h-125 object-cover rounded-2xl shadow-lg transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>

      </section>
    </div>
  );
}