import React, { useState, useEffect } from 'react';

interface LandingPageProps {
  onStartQuiz: () => void;
}

const COURSES_URL = 'https://www.cruzeiroead.com.br/graduacao';
const LOGO_URL = 'https://static.wixstatic.com/media/a9822b_f8f6943da75645e7912e3c38711fe5e5~mv2.png/v1/fill/w_446,h_120,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/a9822b_f8f6943da75645e7912e3c38711fe5e5~mv2.png';

const CheckBadge: React.FC<{ label: string }> = ({ label }) => (
  <span className="inline-flex items-center gap-1.5 bg-white/15 border border-white/25 rounded-full px-3.5 py-1.5 text-white text-sm font-semibold">
    <svg className="w-4 h-4 text-[#FFD700] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
    {label}
  </span>
);

const PrimaryBtn: React.FC<{ label?: string; onClick: () => void; large?: boolean }> = ({
  label = 'Fazer teste grátis',
  onClick,
  large = false,
}) => (
  <button
    onClick={onClick}
    className={`bg-[#FFD700] text-[#002D5E] font-extrabold rounded-xl shadow-md hover:bg-[#E6C200] hover:scale-[1.03] active:scale-95 transition-all duration-200 ${large ? 'text-lg px-10 py-4 min-h-[56px]' : 'text-base px-7 py-3.5 min-h-[48px]'}`}
  >
    {label}
  </button>
);

const SectionCTA: React.FC<{ label?: string; onClick: () => void }> = ({
  label = 'Fazer teste grátis',
  onClick,
}) => (
  <div className="mt-10 flex justify-center">
    <PrimaryBtn label={label} onClick={onClick} />
  </div>
);

const steps = [
  {
    n: '1',
    title: 'Responda algumas perguntas sobre seu perfil',
    desc: 'Escolha as palavras que mais combinam com você entre as opções disponíveis.',
  },
  {
    n: '2',
    title: 'Analisamos suas preferências',
    desc: 'Nossa inteligência artificial mapeia padrões e identifica seu perfil profissional.',
  },
  {
    n: '3',
    title: 'Receba sugestões de cursos ideais',
    desc: 'Você recebe na hora recomendações de cursos e áreas com alta compatibilidade.',
  },
];

const discoveries = [
  {
    icon: (
      <svg className="w-6 h-6 text-[#002D5E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    title: 'Cursos mais compatíveis com seu perfil',
    desc: 'Veja quais graduações têm maior afinidade com suas preferências.',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-[#002D5E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Áreas profissionais ideais para você',
    desc: 'Descubra em quais mercados de trabalho você tem mais potencial.',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-[#002D5E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Seus pontos fortes e interesses',
    desc: 'Entenda melhor suas habilidades dominantes e motivações profissionais.',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-[#002D5E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
    title: 'Sugestão personalizada de graduação',
    desc: 'Receba indicações de cursos superiores alinhados com seu perfil único.',
  },
];

const audiences = [
  {
    icon: (
      <svg className="w-5 h-5 text-[#FFD700] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Em dúvida sobre qual faculdade escolher',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-[#FFD700] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: 'Quer mudar de carreira',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-[#FFD700] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'Quer descobrir novas possibilidades profissionais',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-[#FFD700] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Busca segurança na escolha do curso',
  },
];

const trustItems = [
  {
    icon: (
      <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    label: 'Seguro, gratuito e sem compromisso',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    label: 'Seus dados protegidos',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    ),
    label: 'Sem necessidade de pagamento',
  },
];

const faqs = [
  {
    q: 'O teste é gratuito?',
    a: 'Sim. O teste é 100% gratuito e você recebe o resultado imediatamente.',
  },
  {
    q: 'Preciso me inscrever em um curso depois?',
    a: 'Não. O teste não gera nenhuma obrigação de matrícula. É apenas uma ferramenta de orientação.',
  },
  {
    q: 'Quanto tempo leva?',
    a: 'Em média 2 minutos. Rápido, simples e com resultado imediato.',
  },
  {
    q: 'Meus dados ficam seguros?',
    a: 'Sim. Seus dados são protegidos e usados apenas para personalizar sua experiência.',
  },
];

const HEADER_H = 72;

const LandingPage: React.FC<LandingPageProps> = ({ onStartQuiz }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── STICKY HEADER ── */}
      <header
        style={{ height: HEADER_H }}
        className={`sticky top-0 z-50 bg-[#002D5E] transition-shadow duration-200 ${scrolled ? 'shadow-lg' : ''}`}
      >
        <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
          <img
            src={LOGO_URL}
            alt="Cruzeiro EAD — Ensino Superior EAD"
            style={{ height: 40, width: 'auto', objectFit: 'contain', display: 'block', flexShrink: 0 }}
            referrerPolicy="no-referrer"
            decoding="async"
          />
          <nav className="flex items-center gap-3 flex-shrink-0">
            <a
              href={COURSES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center border border-white/30 text-white font-semibold text-sm px-4 py-2 rounded-lg hover:bg-white/10 hover:border-white/50 active:scale-95 transition-all duration-200 min-h-[44px]"
            >
              Ver cursos
            </a>
            <button
              onClick={onStartQuiz}
              className="bg-[#FFD700] text-[#002D5E] font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-[#E6C200] hover:scale-[1.03] active:scale-95 transition-all duration-200 min-h-[44px] shadow"
            >
              Fazer teste grátis
            </button>
          </nav>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="bg-[#002D5E] px-4 pt-12 pb-16 md:pt-16 md:pb-20 overflow-hidden relative">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 75% 35%, #FFD700 0%, transparent 55%)' }} />
        <div className={`max-w-3xl mx-auto text-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-7">
            <span className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse flex-shrink-0" />
            <span className="text-white/80 text-sm font-medium">+35.000 alunos já descobriram seu curso ideal</span>
          </div>

          <h1 className="text-white text-[2rem] sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold leading-tight mb-4">
            Descubra o curso ideal<br className="hidden sm:block" /> para você em 2 minutos
          </h1>

          <p className="text-blue-200 text-lg md:text-xl mb-7 leading-relaxed">
            Teste vocacional gratuito com resultado imediato.
          </p>

          <div className="flex flex-wrap justify-center gap-2.5 mb-9">
            <CheckBadge label="100% gratuito" />
            <CheckBadge label="Tempo médio 2 minutos" />
            <CheckBadge label="Resultado imediato" />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartQuiz}
              className="w-full sm:w-auto bg-[#FFD700] text-[#002D5E] font-extrabold text-lg px-10 py-4 rounded-xl shadow-lg hover:bg-[#E6C200] hover:scale-[1.03] active:scale-95 transition-all duration-200 min-h-[56px]"
            >
              Fazer teste grátis
            </button>
            <a
              href={COURSES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto border-2 border-white/30 text-white font-semibold text-base px-8 py-4 rounded-xl hover:border-white/60 hover:bg-white/10 active:scale-95 transition-all duration-200 min-h-[56px] flex items-center justify-center"
            >
              Ver cursos e mensalidades
            </a>
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section className="bg-slate-50 px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-[#002D5E] text-2xl md:text-4xl font-extrabold mb-3">Como funciona?</h2>
            <p className="text-slate-500 text-base md:text-lg">Simples, rápido e sem complicação</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div
                key={step.n}
                className="bg-white rounded-2xl p-7 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-full bg-[#FFD700] flex items-center justify-center mb-5">
                  <span className="text-[#002D5E] font-extrabold text-lg leading-none">{step.n}</span>
                </div>
                <h3 className="text-[#002D5E] font-bold text-lg mb-2 leading-snug">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <SectionCTA label="Começar teste agora" onClick={onStartQuiz} />
        </div>
      </section>

      {/* ── O QUE VOCÊ DESCOBRE ── */}
      <section className="bg-white px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-[#002D5E] text-2xl md:text-4xl font-extrabold mb-3">O que você descobre com o teste?</h2>
            <p className="text-slate-500 text-base md:text-lg">Resultado personalizado gerado em instantes</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {discoveries.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 bg-slate-50 border border-slate-100 rounded-2xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="bg-[#eef4ff] rounded-xl p-3 flex-shrink-0">{item.icon}</div>
                <div>
                  <h3 className="text-[#002D5E] font-bold text-base mb-1 leading-snug">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <SectionCTA onClick={onStartQuiz} />
        </div>
      </section>

      {/* ── PARA QUEM É ── */}
      <section className="bg-[#002D5E] px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-white text-2xl md:text-4xl font-extrabold mb-3">Para quem é este teste?</h2>
            <p className="text-blue-200 text-base md:text-lg">Para qualquer pessoa que queira tomar uma decisão mais segura</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {audiences.map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-4 bg-white/10 border border-white/15 rounded-2xl px-6 py-5 hover:bg-white/15 transition-colors duration-200"
              >
                {item.icon}
                <p className="text-white font-medium text-base leading-snug flex-1">{item.title}</p>
                <svg className="flex-shrink-0 w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <button
              onClick={onStartQuiz}
              className="bg-[#FFD700] text-[#002D5E] font-extrabold text-base px-8 py-4 rounded-xl shadow hover:bg-[#E6C200] hover:scale-[1.03] active:scale-95 transition-all duration-200 min-h-[52px]"
            >
              Fazer teste grátis
            </button>
          </div>
        </div>
      </section>

      {/* ── CONFIANÇA ── */}
      <section className="bg-white px-4 py-12 md:py-16 border-y border-slate-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-[#002D5E] text-2xl md:text-3xl font-extrabold mb-8">Transparência e segurança em cada etapa</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
            {trustItems.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                {item.icon}
                <span className="text-slate-700 font-medium text-base">{item.label}</span>
              </div>
            ))}
          </div>
          <SectionCTA onClick={onStartQuiz} />
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-slate-50 px-4 py-12 md:py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-[#002D5E] text-2xl md:text-3xl font-extrabold">Perguntas frequentes</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50 transition-colors duration-150 min-h-[60px]"
                  aria-expanded={openFaq === i}
                >
                  <span className="text-[#002D5E] font-semibold text-base pr-4">{faq.q}</span>
                  <svg
                    className={`w-5 h-5 text-[#002D5E] flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-slate-600 text-base leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="bg-[#002D5E] px-4 py-12 md:py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-white text-2xl md:text-4xl font-extrabold mb-4 leading-tight">
            Descubra agora seu curso ideal
          </h2>
          <p className="text-blue-200 text-lg mb-10">
            Gratuito. Resultado imediato. Sem compromisso.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartQuiz}
              className="w-full sm:w-auto bg-[#FFD700] text-[#002D5E] font-extrabold text-lg px-10 py-4 rounded-xl shadow-lg hover:bg-[#E6C200] hover:scale-[1.03] active:scale-95 transition-all duration-200 min-h-[56px]"
            >
              Fazer teste grátis
            </button>
            <a
              href={COURSES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto border-2 border-white/30 text-white font-semibold text-base px-8 py-4 rounded-xl hover:border-white/60 hover:bg-white/10 active:scale-95 transition-all duration-200 min-h-[56px] flex items-center justify-center"
            >
              Ver cursos e mensalidades
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#001e3f] px-4 py-7">
        <div className="max-w-4xl mx-auto text-center">
          <img
            src={LOGO_URL}
            alt="Cruzeiro EAD"
            style={{ height: 32, width: 'auto', objectFit: 'contain', display: 'block', margin: '0 auto 12px', opacity: 0.5 }}
            referrerPolicy="no-referrer"
            loading="lazy"
            decoding="async"
          />
          <p className="text-white/30 text-xs">
            &copy; {new Date().getFullYear()} Cruzeiro EAD. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* ── MOBILE STICKY CTA ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-safe-area-inset-bottom pb-4 pt-3 bg-white border-t border-slate-200 shadow-[0_-4px_16px_rgba(0,0,0,0.10)]">
        <button
          onClick={onStartQuiz}
          className="w-full bg-[#FFD700] text-[#002D5E] font-extrabold text-base py-4 rounded-xl shadow-md active:scale-95 transition-all duration-200 min-h-[52px]"
        >
          Fazer teste grátis — Gratuito
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
