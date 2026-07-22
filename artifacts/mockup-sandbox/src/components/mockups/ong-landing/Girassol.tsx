import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Leaf, Users, HeartHandshake, MessageCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Logo = ({ size = 48, className = "", textColor = "text-white" }: { size?: number, className?: string, textColor?: string }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <svg viewBox="0 0 64 64" width={size} height={size} className="flex-shrink-0 drop-shadow-md">
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
    <div className={`flex flex-col font-extrabold tracking-tighter leading-[0.8] ${textColor}`}>
      <span className="text-[1.3em]">VIVER</span>
      <span className="text-[1.3em]">FELIZ</span>
    </div>
  </div>
);

export default function Girassol() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-[#F5C842] selection:text-black overflow-x-hidden" style={{ fontFamily: '"Manrope", sans-serif' }}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
        
        .hero-bg {
          background-image: url('/__mockup/images/ong-girassol-hero.jpg');
          background-size: cover;
          background-position: center;
        }
        
        .charcoal-overlay {
          background: linear-gradient(135deg, rgba(17, 17, 17, 0.95) 0%, rgba(17, 17, 17, 0.8) 100%);
        }

        .yellow-accent-bar {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 8px;
          background-color: #F5C842;
        }

        .btn-yellow {
          background-color: #F5C842;
          color: #111111;
          font-weight: 800;
          transition: all 0.2s ease;
        }
        .btn-yellow:hover {
          background-color: #e5b632;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(245, 200, 66, 0.4);
        }
      `}} />

      {/* Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-[#111111]/95 backdrop-blur-md py-4 shadow-xl' : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          <Logo size={40} textColor="text-white" />
          
          <nav className="hidden lg:flex items-center gap-8 font-bold text-sm tracking-wide text-white/90">
            <a href="#" className="hover:text-[#F5C842] transition-colors">Início</a>
            <a href="#quem-somos" className="hover:text-[#F5C842] transition-colors">Quem Somos</a>
            <a href="#" className="hover:text-[#F5C842] transition-colors">Catálogo</a>
            <a href="#" className="hover:text-[#F5C842] transition-colors">Blog</a>
            <a href="#" className="hover:text-[#F5C842] transition-colors">Depoimentos</a>
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <Button variant="ghost" className="text-white hover:text-[#F5C842] hover:bg-white/10 font-bold uppercase tracking-wider text-xs">
              Como ajudar
            </Button>
            <Button className="btn-yellow uppercase tracking-wider text-xs h-11 px-6 rounded-none">
              Ver Catálogo
            </Button>
          </div>

          <button 
            className="lg:hidden text-white p-2" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#111111] pt-28 px-6 pb-6 flex flex-col justify-between">
          <nav className="flex flex-col gap-6 text-2xl font-bold text-white">
            <a href="#" className="hover:text-[#F5C842]" onClick={() => setMobileMenuOpen(false)}>Início</a>
            <a href="#quem-somos" className="hover:text-[#F5C842]" onClick={() => setMobileMenuOpen(false)}>Quem Somos</a>
            <a href="#" className="hover:text-[#F5C842]" onClick={() => setMobileMenuOpen(false)}>Catálogo</a>
            <a href="#" className="hover:text-[#F5C842]" onClick={() => setMobileMenuOpen(false)}>Blog</a>
            <a href="#" className="hover:text-[#F5C842]" onClick={() => setMobileMenuOpen(false)}>Depoimentos</a>
          </nav>
          <div className="flex flex-col gap-4 mt-8">
            <Button variant="outline" className="border-white/20 text-black hover:bg-white/10 font-bold h-14 text-lg">
              Como ajudar
            </Button>
            <Button className="btn-yellow font-bold h-14 text-lg rounded-none">
              Ver Catálogo
            </Button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center pt-24 pb-16 hero-bg overflow-hidden">
        <div className="absolute inset-0 charcoal-overlay"></div>
        
        {/* Massive decorative accent */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] bg-[#F5C842] rounded-full blur-[120px] opacity-20 pointer-events-none"></div>

        <div className="container relative z-10 mx-auto px-6 md:px-12 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-9 relative">
            {/* Dramatic vertical yellow line */}
            <div className="absolute -left-6 md:-left-12 top-2 bottom-2 w-2 md:w-3 bg-[#F5C842]"></div>
            
            <div className="inline-block px-4 py-1.5 bg-[#F5C842] text-[#111111] font-extrabold text-sm tracking-widest uppercase mb-8">
              Santa Rita do Sapucaí, MG • Desde 1999
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-[1.05] tracking-tight mb-8">
              Cada <span className="text-[#F5C842]">planta</span> e cada artesanato carrega uma <span className="text-[#F5C842]">história</span>.
            </h1>
            
            <p className="text-xl md:text-2xl text-zinc-300 font-medium max-w-3xl leading-relaxed mb-10">
              Ao levar um item para casa, você apoia diretamente as famílias atendidas pela ONG Viver Feliz. <span className="text-white font-bold">Cultive esperança com a gente.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="btn-yellow h-16 px-10 text-lg uppercase tracking-wider rounded-none">
                Ver o catálogo <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" className="h-16 px-10 text-lg uppercase tracking-wider rounded-none border-white/30 text-white bg-transparent hover:bg-white hover:text-black font-bold">
                Como ajudar
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quem Somos - Mission & Pillars */}
      <section id="quem-somos" className="py-24 md:py-32 bg-white relative">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <h2 className="text-[#111111] font-extrabold text-4xl md:text-5xl tracking-tight mb-6">
              Semeando alegria, <br className="hidden md:block"/>colhendo <span className="relative whitespace-nowrap">
                transformação
                <span className="absolute -bottom-2 left-0 right-0 h-3 bg-[#F5C842]/40 -z-10"></span>
              </span>.
            </h2>
            <p className="text-xl text-zinc-600 font-medium">
              Nossa missão é difundir conceitos para uma vida mais saudável e feliz, apoiando famílias em situação de vulnerabilidade através de hortas comunitárias, oficinas de artesanato e suporte psicológico e social.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="bg-[#111111] text-white p-10 relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5C842] rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
              <HeartHandshake className="w-12 h-12 text-[#F5C842] mb-8 relative z-10" />
              <h3 className="text-2xl font-extrabold mb-4 relative z-10">Acolhimento</h3>
              <p className="text-zinc-400 font-medium leading-relaxed relative z-10">
                A escuta ativa é o nosso primeiro passo. Oferecemos suporte psicológico e uma rede de apoio segura para quem mais precisa.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-zinc-100 p-10 relative border-b-4 border-[#F5C842] hover:bg-zinc-200 transition-colors">
              <Leaf className="w-12 h-12 text-[#111111] mb-8" />
              <h3 className="text-2xl font-extrabold mb-4 text-[#111111]">Natureza</h3>
              <p className="text-zinc-600 font-medium leading-relaxed">
                Nossa horta terapêutica é um espaço de cura, aprendizado e reconexão. Onde mãos tocam a terra e cultivam novos começos.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-[#F5C842] text-[#111111] p-10 relative shadow-[8px_8px_0px_#111111] transition-transform hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_#111111]">
              <Users className="w-12 h-12 mb-8" />
              <h3 className="text-2xl font-extrabold mb-4">Autonomia</h3>
              <p className="text-[#111111]/80 font-bold leading-relaxed">
                Oficinas de artesanato que geram renda, capacitação profissional e resgatam a dignidade e independência das famílias.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Como Ajudar / WhatsApp CTA */}
      <section className="py-24 bg-[#111111] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 bg-white/5 p-8 md:p-16 border border-white/10 backdrop-blur-sm">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Faça parte desta rede de <span className="text-[#F5C842]">solidariedade</span>.</h2>
              <p className="text-xl text-zinc-400 font-medium mb-0">
                Seja comprando nossos produtos, doando seu tempo como voluntário ou contribuindo financeiramente, toda ajuda faz a diferença.
              </p>
            </div>
            <div className="flex-shrink-0 w-full md:w-auto">
              <Button className="w-full md:w-auto bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-lg h-16 px-10 rounded-none shadow-[4px_4px_0px_#ffffff] transition-transform hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_#ffffff]">
                <MessageCircle className="mr-3 h-6 w-6" /> Falar no WhatsApp
              </Button>
              <p className="text-center mt-4 text-zinc-500 font-bold tracking-widest">(35) 98705-4358</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white pt-20 pb-10 border-t border-white/10">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <Logo size={56} className="mb-6" />
              <p className="text-zinc-400 font-medium max-w-sm mb-8 leading-relaxed">
                Difundindo conceitos para uma vida mais saudável e feliz em Santa Rita do Sapucaí desde 1999.
              </p>
              <div className="flex gap-4">
                {/* Social placeholders */}
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#F5C842] hover:text-black transition-colors cursor-pointer">
                  IN
                </div>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#F5C842] hover:text-black transition-colors cursor-pointer">
                  FB
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-extrabold text-lg mb-6 uppercase tracking-wider text-[#F5C842]">Navegação</h4>
              <ul className="flex flex-col gap-4 font-medium text-zinc-400">
                <li><a href="#" className="hover:text-white transition-colors">Início</a></li>
                <li><a href="#quem-somos" className="hover:text-white transition-colors">Quem Somos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Catálogo Solidário</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Nosso Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Depoimentos</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-extrabold text-lg mb-6 uppercase tracking-wider text-[#F5C842]">Contato</h4>
              <ul className="flex flex-col gap-4 font-medium text-zinc-400">
                <li>Santa Rita do Sapucaí, MG</li>
                <li>(35) 98705-4358</li>
                <li>contato@ongviverfeliz.org.br</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-600 font-medium text-sm">
            <p>&copy; {new Date().getFullYear()} ONG Viver Feliz. Todos os direitos reservados.</p>
            <p>Design de Impacto</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
