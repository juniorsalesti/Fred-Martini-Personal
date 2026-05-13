import { useEffect, useRef, useState, type ReactNode } from 'react';
import { 
  Instagram, 
  MessageCircle, 
  MapPin, 
  Dumbbell, 
  Wifi, 
  Target, 
  Star, 
  Menu, 
  X, 
  ChevronRight,
  TrendingUp,
  Quote
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Components ---

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('a')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-primary pointer-events-none z-[9999] transition-transform duration-150 ease-out hidden lg:block"
      style={{ 
        transform: `translate3d(${position.x - 16}px, ${position.y - 16}px, 0) scale(${isHovering ? 1.5 : 1})`,
        backgroundColor: isHovering ? 'rgba(232, 93, 4, 0.2)' : 'transparent'
      }}
    />
  );
};

const SectionHeading = ({ children, subtitle }: { children: ReactNode, subtitle?: string }) => (
  <div className="mb-12 reveal">
    <h2 className="text-4xl md:text-5xl font-display font-black uppercase text-white tracking-widest">
      {children}
    </h2>
    <div className="h-1 w-20 bg-primary mt-4 mb-4"></div>
    {subtitle && <p className="text-gray-400 font-sans">{subtitle}</p>}
  </div>
);

const Counter = ({ value, label, suffix = "" }: { value: string, label: string, suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !triggered) {
        setTriggered(true);
        let start = 0;
        const end = parseFloat(value.replace(/[^\d.]/g, ''));
        const duration = 1500;
        const startTime = performance.now();

        const update = (now: number) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const currentCount = progress * end;
          setCount(currentCount);
          if (progress < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
      }
    }, { threshold: 0.5 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, triggered]);

  return (
    <div ref={ref} className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
      <div className="text-4xl md:text-5xl font-accent font-bold text-white mb-2">
        {count.toLocaleString('pt-BR', { maximumFractionDigits: (value.includes(',') || value.includes('.')) ? 1 : 0 })}{suffix}
      </div>
      <div className="text-sm uppercase tracking-widest text-primary font-bold">
        {label}
      </div>
    </div>
  );
};

const TestimonialCarousel = () => {
  const testimonials = [
    {
      name: "Fabian Gonzalez",
      text: "Ótimo professor!! Treinos dinâmicos e que trouxeram os resultados desejados. Recomendo!!!",
      stars: 5
    },
    {
      name: "Rodrigo Scapin",
      text: "Comunicação, Qualidade, Profissionalismo. Resultado acima da média.",
      stars: 5
    },
    {
      name: "Bruno José Martini",
      text: "Qualidade, Profissionalismo e foco no aluno. O melhor da região.",
      stars: 5
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <div className="relative overflow-hidden w-full max-w-4xl mx-auto px-4 py-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="bg-card p-10 rounded-2xl border border-white/5 relative"
        >
          <Quote className="absolute top-6 left-6 text-primary opacity-20 w-16 h-16" />
          <div className="flex mb-4">
            {[...Array(testimonials[currentIndex].stars)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            ))}
          </div>
          <p className="text-xl italic text-gray-300 mb-8 leading-relaxed">
            "{testimonials[currentIndex].text}"
          </p>
          <div className="font-bold text-white text-lg font-display uppercase tracking-wider">
            {testimonials[currentIndex].name}
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-center mt-8 gap-2">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-primary w-8' : 'bg-gray-600'}`}
          />
        ))}
      </div>
    </div>
  );
};

// --- App Main ---

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const reveals = document.querySelectorAll('.reveal');
      reveals.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const triggerPoint = window.innerHeight * 0.85;
        if (rect.top < triggerPoint) {
          el.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'SOBRE', href: '#sobre' },
    { name: 'SERVIÇOS', href: '#servicos' },
    { name: 'DEPOIMENTOS', href: '#depoimentos' },
    { name: 'CONTATO', href: '#contato' },
  ];

  return (
    <div className="min-h-screen font-sans bg-dark selection:bg-primary selection:text-white">
      <CustomCursor />
      
      {/* --- HEADER --- */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-black/40 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <a href="#" className="flex items-center gap-4 group">
            <div className="bg-primary text-black font-black px-3 py-1 text-2xl tracking-tighter transform group-hover:scale-110 transition-transform">FM</div>
            <span className="font-display font-bold text-xl tracking-widest uppercase text-white">FRED MARTINI</span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-[10px] tracking-[0.2em] uppercase font-semibold text-gray-300 hover:text-primary transition-colors"
              >
                {link.name}
              </a>
            ))}
            <a 
              href="https://wa.me/5519983247343" 
              className="border border-primary px-8 py-2.5 text-[10px] tracking-widest uppercase font-bold text-white hover:bg-primary hover:text-black transition-all duration-300 active:scale-95"
            >
              FALAR COM FRED
            </a>
          </nav>

          {/* Mobile Menu Toggle */}
          <button className="lg:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-black/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
            >
              <div className="flex flex-col p-8 gap-8">
                {navLinks.map((link) => (
                  <a 
                    key={link.name} 
                    href={link.href} 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-2xl font-display font-black tracking-widest uppercase"
                  >
                    {link.name}
                  </a>
                ))}
                <a 
                  href="https://wa.me/5519983247343"
                  className="bg-primary text-black py-4 rounded-sm font-black text-center tracking-widest uppercase text-sm"
                >
                  FALAR COM FRED
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* --- HERO --- */}
      <section className="relative min-h-screen flex items-center pt-24 px-6 md:px-12 overflow-hidden bg-dark">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 bg-noise z-0 pointer-events-none opacity-[0.03]"></div>
        
        <div className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-20 right-1/4 w-[300px] h-[300px] bg-secondary/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] opacity-10 pointer-events-none diagonal-pattern"></div>

        <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2 rounded-full mb-8"
            >
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} size={10} className="text-primary fill-primary" />)}
              </div>
              <span className="text-[9px] uppercase tracking-[0.2em] font-black text-white/80">5,0 no Google</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl sm:text-7xl md:text-[100px] lg:text-[140px] font-display font-black text-white leading-[0.8] tracking-tighter mb-8 uppercase italic"
            >
              TRANSFORMO <br />
              <span className="text-transparent" style={{ WebkitTextStroke: '1.5px var(--color-primary)' }}>CORPOS</span> DE <br />
              <span className="text-white text-glow">VERDADE</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-2xl text-gray-400 font-sans font-medium mb-10 max-w-2xl"
            >
              Emagrecimento & Hipertrofia. Campinas, Valinhos ou Online. <br className="hidden md:block" />
              Treino direto, sem frescura e resultados reais.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center gap-6 md:gap-8"
            >
              <a 
                href="#contato"
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary px-10 py-5 md:px-12 md:py-6 text-base md:text-lg font-black uppercase tracking-[0.1em] text-white transform hover:scale-105 active:scale-95 transition-all shadow-[0_15px_40px_rgba(232,93,4,0.3)] text-center"
              >
                COMEÇAR AGORA
              </a>
              <a 
                href="#sobre"
                className="text-sm uppercase tracking-[0.2em] border-b border-primary pb-1 font-bold text-white hover:text-primary transition-colors flex items-center gap-2"
              >
                Ver Resultados ↓
              </a>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-20 hidden md:flex">
          <span className="text-[9px] tracking-[0.4em] font-black uppercase text-white/50">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent"></div>
        </div>
      </section>

      {/* --- ABOUT --- */}
      <section id="sobre" className="py-20 md:py-24 px-6 md:px-12 relative bg-dark">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="reveal relative">
            <div className="aspect-square md:aspect-[4/5] bg-gradient-to-tr from-black to-[#1a1a1a] rounded-none overflow-hidden relative border border-white/10">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 md:p-12 opacity-20">
                <Dumbbell size={60} className="md:size-20 text-primary mb-4 md:mb-6 animate-pulse" />
                <p className="font-display text-4xl md:text-5xl font-black tracking-widest text-center uppercase">FOTO <br />FRED</p>
              </div>
              {/* Accents */}
              <div className="absolute -top-3 -left-3 md:-top-6 md:-left-6 w-20 md:w-32 h-20 md:h-32 border-t border-l border-primary/30 pointer-events-none"></div>
              <div className="absolute -bottom-3 -right-3 md:-bottom-6 md:-right-6 w-20 md:w-32 h-20 md:h-32 border-b border-r border-primary/30 pointer-events-none"></div>
            </div>
            {/* Float badge */}
            <div className="absolute -bottom-6 md:-bottom-10 -left-3 md:-left-6 bg-white p-4 md:p-6 shadow-2xl transform rotate-[-3deg]">
              <p className="text-black font-black uppercase text-sm md:text-xl leading-none">Resultado <br /><span className="text-primary">Garantido</span></p>
            </div>
          </div>

          <div className="reveal pt-8 md:pt-0">
            <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary mb-4 md:mb-6">Treino Direto e Sem Frescura</h3>
            <h2 className="text-4xl md:text-6xl font-display font-black text-white mb-6 md:mb-10 tracking-tighter italic uppercase leading-tight md:leading-none">
              Transformar vidas é o meu <span className="text-primary">compromisso</span>
            </h2>
            <div className="space-y-6 md:space-y-8 text-gray-400 text-base md:text-lg leading-relaxed mb-10 md:mb-12">
              <p>
                Sou o <span className="text-white font-bold">Fred Martini</span>, personal trainer com foco em resultados reais. Atendo em Campinas, Valinhos e região — e também online para quem quer treinar com método, sem enrolação.
              </p>
              <p className="border-l-2 md:border-l-4 border-primary pl-6 md:pl-8 italic text-sm md:text-lg">
                "Não acredito em fórmulas mágicas. Acredito em biomecânica aplicada, constância e a vontade de ser melhor a cada dia."
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {['💪 Emagrecimento', '🔥 Hipertrofia', '📍 Campinas/Valinhos', '🌎 Consultoria Online'].map(tag => (
                <div key={tag} className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 md:p-4">
                  <span className="text-[9px] md:text-[10px] font-black tracking-widest text-white uppercase">{tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- SERVICES --- */}
      <section id="servicos" className="py-32 px-6 md:px-12 bg-[#0c0c0c] border-y border-white/5 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto">
          <SectionHeading subtitle="O que eu ofereço para sua evolução.">
            METODOLOGIA FM
          </SectionHeading>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Treino Presencial",
                info: "Campinas/Valinhos",
                icon: <Dumbbell className="text-primary w-10 h-10" />,
                desc: "Atendimento personalizado individual ou em duplas em academias parceiras."
              },
              {
                title: "Consultoria Online",
                info: "Atendimento Nacional",
                icon: <Wifi className="text-primary w-10 h-10" />,
                desc: "Plano completo via app com vídeos, planilhas e suporte 24h via WhatsApp."
              },
              {
                title: "Alta Performance",
                info: "Foco Total",
                icon: <Target className="text-primary w-10 h-10" />,
                desc: "Protocolos específicos para quem busca resultados extremos em tempo reduzido."
              }
            ].map((service, idx) => (
              <div 
                key={idx} 
                className="reveal group bg-white/5 hover:bg-white/10 border border-white/10 p-10 transition-all duration-500 hover:border-primary"
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div className="flex justify-between items-start mb-10">
                  <div className="p-4 bg-white/5 rounded-sm transform group-hover:rotate-6 transition-transform">{service.icon}</div>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-bold group-hover:text-primary">{service.info}</span>
                </div>
                <h3 className="text-3xl font-display font-black text-white mb-6 uppercase italic tracking-tighter">{service.title}</h3>
                <p className="text-gray-400 mb-8 leading-relaxed text-sm">{service.desc}</p>
                <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-primary uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                  Saber mais <ChevronRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section id="depoimentos" className="py-32 px-6 md:px-12 bg-dark">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-5 reveal">
              <SectionHeading subtitle="O depoimento de quem viveu a transformação na pele.">
                RESULTADOS REAIS
              </SectionHeading>
              <div className="bg-white/5 border-l-4 border-primary p-10 backdrop-blur-sm">
                <p className="italic text-gray-300 text-xl mb-10 leading-relaxed">
                  "Ótimo professor! Treinos dinâmicos e que trouxeram os resultados desejados. Recomendo com certeza para quem quer mudar de vez."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center font-bold text-primary">FG</div>
                  <div>
                    <p className="text-white font-black uppercase tracking-widest text-xs">Fabian Gonzalez</p>
                    <p className="text-primary uppercase tracking-widest text-[9px] font-bold">Aluno Consultoria</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-7 reveal">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { name: "Rodrigo Scapin", text: "Excelente profissional. Qualidade técnica, profissionalismo e foco no objetivo do aluno." },
                  { name: "Bruno José Martini", text: "Treino direto, sem enrolação. Resultados visíveis em poucos meses de acompanhamento." }
                ].map((t, idx) => (
                  <div key={idx} className="bg-white/5 p-8 border border-white/10 hover:border-primary/30 transition-colors">
                    <Quote className="text-primary/20 mb-4" size={24} />
                    <p className="text-gray-400 text-sm mb-8 leading-relaxed">{t.text}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1 text-yellow-500">
                        <Star size={10} fill="currentColor" />
                        <Star size={10} fill="currentColor" />
                        <Star size={10} fill="currentColor" />
                        <Star size={10} fill="currentColor" />
                        <Star size={10} fill="currentColor" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest white">{t.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section id="contato" className="py-16 md:py-24 px-4 md:px-12 bg-dark">
        <div className="max-w-7xl mx-auto relative overflow-hidden">
          <div className="bg-gradient-to-br from-primary to-secondary p-10 md:p-24 text-center group relative">
            <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none"></div>
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-5xl md:text-[100px] font-display font-black text-white mb-6 md:mb-8 uppercase italic tracking-tighter leading-none">
                VAI FICAR <br className="hidden md:block" /> <span className="text-black">SÓ OLHANDO?</span>
              </h2>
              <p className="text-lg md:text-2xl text-white/90 mb-10 md:text-center md:mb-16 max-w-2xl mx-auto font-medium">
                Sua transformação começa com uma mensagem. <br className="hidden md:block" /> Escolha o caminho dos resultados.
              </p>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
                <a 
                  href="https://wa.me/5519983247343"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto bg-white text-black font-black text-lg md:text-xl px-10 py-5 md:px-12 md:py-6 rounded-none hover:bg-black hover:text-white transition-all transform hover:scale-105 shadow-2xl text-center"
                >
                  FALAR NO WHATSAPP
                </a>
                <div className="text-left hidden md:block">
                  <p className="text-xs uppercase tracking-widest text-black/60 font-black mb-1">Contato Direto</p>
                  <p className="text-xl font-display font-black text-white">(19) 98324-7343</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-black py-12 md:py-16 px-6 md:px-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10 md:gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary text-black font-black px-3 py-1 text-xl md:text-2xl tracking-tighter">FM</div>
            <div className="text-lg md:text-xl font-display font-bold tracking-widest uppercase text-white">Fred Martini</div>
          </div>

          <div className="text-[9px] md:text-[10px] tracking-[0.3em] text-gray-500 uppercase font-black text-center order-3 md:order-2">
            © 2025 Fred Martini · Todos os direitos reservados
          </div>

          <div className="flex gap-6 md:gap-8 order-2 md:order-3">
            {['Instagram', 'WhatsApp', 'Google'].map(social => (
              <a 
                key={social}
                href="#" 
                className="text-[10px] tracking-[0.2em] text-gray-500 hover:text-primary uppercase font-black transition-colors"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* --- Floating WhatsApp --- */}
      <a 
        href="https://wa.me/5519983247343"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[100] group"
        aria-label="Falar no WhatsApp"
      >
        <div className="relative">
          {/* Pulse Ripple Effect */}
          <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-25"></div>
          
          {/* Main Button */}
          <div className="relative bg-[#25D366] w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.4)] transform group-hover:scale-110 transition-transform duration-300">
            <svg 
              viewBox="0 0 24 24" 
              className="w-8 h-8 md:w-9 md:h-9 fill-white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.433 5.628 1.434h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
        </div>
      </a>
    </div>
  );
}
