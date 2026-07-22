import React, { useState, useEffect } from 'react';
import { Menu, X, Heart, Leaf, Users, ArrowRight, MessageCircle, Instagram, Facebook, Mail, MapPin } from 'lucide-react';

const SunflowerLogo = ({ className = '', size = 64, opacity = 1 }: { className?: string, size?: number | string, opacity?: number }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} className={className} style={{ opacity }}>
    <g transform="translate(32 32)">
      <ellipse cx="0" cy="-18" rx="6" ry="12" fill="#F5C842" transform="rotate(0)" />
      <ellipse cx="0" cy="-18" rx="6" ry="12" fill="#F5C842" transform="rotate(30)" />
      <ellipse cx="0" cy="-18" rx="6" ry="12" fill="#F5C842" transform="rotate(60)" />
      <ellipse cx="0" cy="-18" rx="6" ry="12" fill="#F5C842" transform="rotate(90)" />
      <ellipse cx="0" cy="-18" rx="6" ry="12" fill="#F5C842" transform="rotate(120)" />
      <ellipse cx="0" cy="-18" rx="6" ry="12" fill="#F5C842" transform="rotate(150)" />
      <ellipse cx="0" cy="-18" rx="6" ry="12" fill="#F5C842" transform="rotate(180)" />
      <ellipse cx="0" cy="-18" rx="6" ry="12" fill="#F5C842" transform="rotate(210)" />
      <ellipse cx="0" cy="-18" rx="6" ry="12" fill="#F5C842" transform="rotate(240)" />
      <ellipse cx="0" cy="-18" rx="6" ry="12" fill="#F5C842" transform="rotate(270)" />
      <ellipse cx="0" cy="-18" rx="6" ry="12" fill="#F5C842" transform="rotate(300)" />
      <ellipse cx="0" cy="-18" rx="6" ry="12" fill="#F5C842" transform="rotate(330)" />
      <circle r="9" fill="#5C3D1E" />
      <circle r="6" fill="#3D2510" />
    </g>
  </svg>
);

export default function Enraizada() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Início', href: '#' },
    { name: 'Quem Somos', href: '#quem-somos' },
    { name: 'Catálogo', href: '#catalogo' },
    { name: 'Blog', href: '#blog' },
    { name: 'Depoimentos', href: '#depoimentos' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#2c3e35] font-sans selection:bg-[#F5C842] selection:text-[#1a3d2b] overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap');
        
        .font-serif {
          font-family: 'Playfair Display', serif;
        }
        .font-sans {
          font-family: 'Inter', sans-serif;
        }
      `}</style>

      {/* Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-[#1a3d2b] py-3 shadow-lg' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-3 z-50 relative">
            <SunflowerLogo size={isScrolled ? 36 : 48} className="transition-all duration-300" />
            <div>
              <h1 className={`font-serif font-bold text-white leading-tight ${isScrolled ? 'text-xl' : 'text-2xl'}`}>
                Viver Feliz
              </h1>
              <p className={`text-[#F5C842] text-xs font-medium tracking-wider uppercase transition-opacity duration-300 ${isScrolled ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
                ONG
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-6">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-white/90 hover:text-[#F5C842] text-sm font-medium transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
            <a 
              href="#ajudar" 
              className="bg-[#F5C842] hover:bg-[#e0b533] text-[#1a3d2b] px-6 py-2.5 rounded-full font-semibold text-sm transition-all hover:scale-105 active:scale-95"
            >
              Como ajudar
            </a>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-white z-50 relative p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Nav Overlay */}
        <div 
          className={`fixed inset-0 bg-[#1a3d2b] z-40 transition-transform duration-500 ease-in-out md:hidden flex flex-col justify-center items-center ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <ul className="flex flex-col items-center gap-8 text-center">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a 
                  href={link.href} 
                  className="text-white text-2xl font-serif hover:text-[#F5C842] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              </li>
            ))}
            <li className="mt-4">
              <a 
                href="#ajudar" 
                className="bg-[#F5C842] text-[#1a3d2b] px-8 py-4 rounded-full font-bold text-lg inline-block"
                onClick={() => setMobileMenuOpen(false)}
              >
                Como ajudar
              </a>
            </li>
          </ul>
          
          <SunflowerLogo size={120} opacity={0.1} className="absolute bottom-[-20px] right-[-20px]" />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-24 overflow-hidden bg-[#1a3d2b]">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/__mockup/images/enraizada-hero.jpg" 
            alt="Horta comunitária" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#1a3d2b]/85 mix-blend-multiply"></div>
          {/* Extra gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a3d2b]/95 via-[#1a3d2b]/80 to-transparent"></div>
        </div>

        {/* Decorative oversized SVG */}
        <div className="absolute top-1/2 -translate-y-1/2 right-[-15%] md:right-[-5%] z-0 pointer-events-none hidden sm:block">
          <SunflowerLogo size={800} opacity={0.06} />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full flex flex-col md:flex-row items-center">
          <div className="md:w-3/5 lg:w-1/2 text-left pt-12 pb-24">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#F5C842]/30 bg-[#F5C842]/10 backdrop-blur-sm text-[#F5C842] text-xs font-semibold uppercase tracking-widest mb-8">
              <Leaf size={14} />
              <span>Desde 1999 • Santa Rita do Sapucaí</span>
            </div>
            
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white font-medium leading-[1.1] mb-6">
              Cada planta e cada artesanato aqui carrega uma história de <span className="text-[#F5C842] italic">acolhimento.</span>
            </h2>
            
            <p className="text-lg md:text-xl text-white/80 font-light mb-10 max-w-lg leading-relaxed">
              Ao levar um item para casa, você apoia diretamente as famílias atendidas pela ONG Viver Feliz. Cultive esperança com a gente.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#catalogo" 
                className="bg-[#F5C842] hover:bg-[#e0b533] text-[#1a3d2b] px-8 py-4 rounded-full font-bold text-base transition-all flex items-center justify-center gap-2 hover:gap-4 group"
              >
                Ver o catálogo
                <ArrowRight size={20} className="transition-all" />
              </a>
              <a 
                href="#ajudar" 
                className="border-2 border-white/30 hover:border-white text-white px-8 py-4 rounded-full font-bold text-base transition-all flex items-center justify-center"
              >
                Como ajudar
              </a>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-[30px] h-[50px] rounded-full border-2 border-white/30 flex justify-center p-2">
            <div className="w-1.5 h-3 bg-[#F5C842] rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Quem Somos / Mission */}
      <section id="quem-somos" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h3 className="text-[#1a3d2b] font-semibold tracking-widest uppercase text-sm mb-4">Nossa Missão</h3>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#1a3d2b] font-medium leading-tight mb-8">
              "Semeando alegria, <br className="hidden md:block"/> colhendo transformação."
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Temos como propósito difundir conceitos para uma vida mais saudável e feliz. 
              Apoiamos famílias em situação de vulnerabilidade através de hortas comunitárias, 
              oficinas de artesanato e acompanhamento psicológico estruturado.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            {/* Pillar 1 */}
            <div className="bg-white p-10 rounded-[2rem] shadow-[0_10px_40px_-15px_rgba(26,61,43,0.1)] border border-gray-100 group hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-[#1a3d2b]/5 rounded-2xl flex items-center justify-center mb-6 text-[#1a3d2b] group-hover:bg-[#1a3d2b] group-hover:text-white transition-colors duration-300">
                <Heart size={28} />
              </div>
              <h4 className="font-serif text-2xl text-[#1a3d2b] mb-4">Acolhimento</h4>
              <p className="text-gray-600 leading-relaxed">
                Oferecemos um espaço seguro de escuta ativa e suporte psicológico para famílias em momentos de fragilidade, fortalecendo vínculos.
              </p>
            </div>
            
            {/* Pillar 2 */}
            <div className="bg-white p-10 rounded-[2rem] shadow-[0_10px_40px_-15px_rgba(26,61,43,0.1)] border border-gray-100 group hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-[#1a3d2b]/5 rounded-2xl flex items-center justify-center mb-6 text-[#1a3d2b] group-hover:bg-[#1a3d2b] group-hover:text-white transition-colors duration-300">
                <Leaf size={28} />
              </div>
              <h4 className="font-serif text-2xl text-[#1a3d2b] mb-4">Natureza</h4>
              <p className="text-gray-600 leading-relaxed">
                Nossa horta terapêutica promove contato com a terra, ensina cultivo sustentável e garante alimentos orgânicos para a comunidade.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white p-10 rounded-[2rem] shadow-[0_10px_40px_-15px_rgba(26,61,43,0.1)] border border-gray-100 group hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-[#1a3d2b]/5 rounded-2xl flex items-center justify-center mb-6 text-[#1a3d2b] group-hover:bg-[#1a3d2b] group-hover:text-white transition-colors duration-300">
                <Users size={28} />
              </div>
              <h4 className="font-serif text-2xl text-[#1a3d2b] mb-4">Autonomia</h4>
              <p className="text-gray-600 leading-relaxed">
                Através de oficinas de capacitação e artesanato, geramos alternativas de renda, devolvendo dignidade e independência.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Images Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative h-[400px] rounded-[2rem] overflow-hidden group">
              <img 
                src="/__mockup/images/enraizada-horta.jpg" 
                alt="Horta terapêutica" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a3d2b]/90 via-[#1a3d2b]/20 to-transparent flex items-end p-10">
                <div>
                  <h4 className="font-serif text-white text-2xl mb-2">Horta Terapêutica</h4>
                  <p className="text-white/80">Cultivando saúde e esperança na terra.</p>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] rounded-[2rem] overflow-hidden group">
              <img 
                src="/__mockup/images/enraizada-oficina.jpg" 
                alt="Oficinas de Artesanato" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a3d2b]/90 via-[#1a3d2b]/20 to-transparent flex items-end p-10">
                <div>
                  <h4 className="font-serif text-white text-2xl mb-2">Oficinas Criativas</h4>
                  <p className="text-white/80">Transformando talento em autonomia.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como Ajudar CTA Section */}
      <section id="ajudar" className="py-24 relative overflow-hidden bg-[#1a3d2b]">
        {/* Decorative SVG Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%">
            <pattern id="sunflowers" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <g transform="scale(0.8)">
                <ellipse cx="32" cy="14" rx="3" ry="6" fill="#FFF" transform="rotate(0 32 32)" />
                <ellipse cx="32" cy="14" rx="3" ry="6" fill="#FFF" transform="rotate(30 32 32)" />
                <ellipse cx="32" cy="14" rx="3" ry="6" fill="#FFF" transform="rotate(60 32 32)" />
                <ellipse cx="32" cy="14" rx="3" ry="6" fill="#FFF" transform="rotate(90 32 32)" />
                <ellipse cx="32" cy="14" rx="3" ry="6" fill="#FFF" transform="rotate(120 32 32)" />
                <ellipse cx="32" cy="14" rx="3" ry="6" fill="#FFF" transform="rotate(150 32 32)" />
                <ellipse cx="32" cy="14" rx="3" ry="6" fill="#FFF" transform="rotate(180 32 32)" />
                <ellipse cx="32" cy="14" rx="3" ry="6" fill="#FFF" transform="rotate(210 32 32)" />
                <ellipse cx="32" cy="14" rx="3" ry="6" fill="#FFF" transform="rotate(240 32 32)" />
                <ellipse cx="32" cy="14" rx="3" ry="6" fill="#FFF" transform="rotate(270 32 32)" />
                <ellipse cx="32" cy="14" rx="3" ry="6" fill="#FFF" transform="rotate(300 32 32)" />
                <ellipse cx="32" cy="14" rx="3" ry="6" fill="#FFF" transform="rotate(330 32 32)" />
                <circle cx="32" cy="32" r="5" fill="#FFF" />
              </g>
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#sunflowers)" />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <div className="bg-[#132b1e]/50 backdrop-blur-md p-10 md:p-16 rounded-[3rem] border border-[#F5C842]/20">
            <SunflowerLogo size={80} className="mx-auto mb-8" />
            <h2 className="font-serif text-3xl md:text-5xl text-white font-medium mb-6">
              Quer fazer parte dessa transformação?
            </h2>
            <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
              Seja através da compra dos nossos produtos, doações ou trabalho voluntário. 
              Entre em contato conosco e descubra como você pode ajudar a cultivar esperança.
            </p>
            <a 
              href="https://wa.me/5535987054358"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              <MessageCircle size={24} />
              Falar no WhatsApp
            </a>
            <p className="text-white/60 text-sm mt-6">
              Ou ligue para nós: (35) 98705-4358
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#132b1e] pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-4 gap-12 mb-16 border-b border-white/10 pb-16">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <SunflowerLogo size={40} />
                <span className="font-serif text-2xl font-bold text-white">Viver Feliz</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                Semeando alegria, colhendo transformação. Uma organização não-governamental dedicada ao apoio familiar desde 1999.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/80 hover:bg-[#F5C842] hover:text-[#1a3d2b] transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/80 hover:bg-[#F5C842] hover:text-[#1a3d2b] transition-colors">
                  <Facebook size={20} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Links Rápidos</h4>
              <ul className="space-y-4">
                {navLinks.map(link => (
                  <li key={link.name}>
                    <a href={link.href} className="text-white/60 hover:text-[#F5C842] transition-colors text-sm">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Nosso Trabalho</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-white/60 hover:text-[#F5C842] transition-colors text-sm">Horta Terapêutica</a></li>
                <li><a href="#" className="text-white/60 hover:text-[#F5C842] transition-colors text-sm">Oficinas de Artesanato</a></li>
                <li><a href="#" className="text-white/60 hover:text-[#F5C842] transition-colors text-sm">Apoio Psicológico</a></li>
                <li><a href="#" className="text-white/60 hover:text-[#F5C842] transition-colors text-sm">Voluntariado</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Contato</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-white/60 text-sm">
                  <MapPin size={18} className="text-[#F5C842] shrink-0 mt-0.5" />
                  <span>Santa Rita do Sapucaí<br/>Minas Gerais - Brasil</span>
                </li>
                <li className="flex items-center gap-3 text-white/60 text-sm">
                  <MessageCircle size={18} className="text-[#F5C842] shrink-0" />
                  <span>(35) 98705-4358</span>
                </li>
                <li className="flex items-center gap-3 text-white/60 text-sm">
                  <Mail size={18} className="text-[#F5C842] shrink-0" />
                  <span>contato@viverfeliz.org.br</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between text-white/40 text-xs">
            <p>&copy; {new Date().getFullYear()} ONG Viver Feliz. Todos os direitos reservados.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
