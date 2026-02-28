import React, { useState } from 'react';

interface LandingPageProps {
  onStartQuiz: () => void;
}

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#FFD700] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const steps = [
  {
    number: '01',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
    title: 'Escolha palavras que combinam com você',
    desc: 'Selecione entre as palavras disponíveis aquelas que mais representam sua personalidade e interesses.'
  },
  {
    number: '02',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'Nossa inteligência artificial analisa seu perfil',
    desc: 'O algoritmo identifica padrões e comportamentos nas suas escolhas para mapear seu perfil profissional.'
  },
  {
    number: '03',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    title: 'Receba recomendações de cursos ideais para você',
    desc: 'Você recebe um relatório personalizado com cursos e áreas de maior compatibilidade com seu perfil.'
  }
];

const benefits = [
  'Seu perfil profissional dominante',
  'Áreas com maior compatibilidade',
  'Cursos ideais para seu perfil',
  'Possíveis caminhos de carreira',
  'Recomendações personalizadas'
];

const audiences = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#002D5E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
    text: 'Estudantes indecisos sobre qual curso escolher'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#002D5E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    text: 'Pessoas que desejam mudar de carreira'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#002D5E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    text: 'Vestibulandos e profissionais buscando direcionamento'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#002D5E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    text: 'Quem quer entender melhor seus pontos fortes'
  }
];

const trustItems = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#002D5E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Institucional educacional',
    desc: 'Desenvolvido pela Cruzeiro EAD, instituição de ensino superior com anos de experiência.'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#002D5E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: '100% gratuito',
    desc: 'Sem custos, sem cadastro obrigatório para iniciar. O teste é completamente gratuito.'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#002D5E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'Recomendação baseada em dados',
    desc: 'Inteligência artificial que analisa seu perfil e gera resultados personalizados e precisos.'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#002D5E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
      </svg>
    ),
    title: 'Suporte humano',
    desc: 'Nossa equipe está disponível para tirar dúvidas e ajudar no seu processo de escolha.'
  }
];

const faqs = [
  {
    q: 'O teste vocacional é gratuito?',
    a: 'Sim. O teste vocacional é totalmente gratuito e sem compromisso. Você pode realizar quantas vezes quiser.'
  },
  {
    q: 'Quanto tempo leva para concluir?',
    a: 'O teste leva em média 2 minutos para ser concluído e o resultado é gerado imediatamente.'
  },
  {
    q: 'Como funciona a análise do perfil?',
    a: 'Nossa inteligência artificial analisa suas escolhas e identifica padrões de comportamento e interesse para gerar seu perfil profissional e recomendar cursos com maior compatibilidade.'
  },
  {
    q: 'Recebo recomendação de cursos?',
    a: 'Sim. Ao final do teste você recebe recomendações personalizadas de cursos e áreas com maior compatibilidade com seu perfil.'
  },
  {
    q: 'Preciso me inscrever em algum curso?',
    a: 'Não. O teste é apenas uma ferramenta de orientação profissional. Você decide se deseja ou não seguir com qualquer recomendação.'
  }
];

const LandingPage: React.FC<LandingPageProps> = ({ onStartQuiz }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      {/* Header */}
      <header className="bg-[#002D5E] px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <img
            src="https://static.wixstatic.com/media/28db79_daac6eb2a3bf4e7393dd5651e96916f3~mv2.png"
            alt="Cruzeiro EAD"
            className="h-10 md:h-12 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
          <button
            onClick={onStartQuiz}
            className="bg-[#FFD700] text-[#002D5E] font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-[#E6C200] transition-all active:scale-95 min-h-[44px]"
          >
            Iniciar teste
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-[#002D5E] px-4 pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-[#FFD700] rounded-full animate-pulse"></span>
            <span className="text-white/80 text-sm font-medium">Mais de 50.000 testes realizados</span>
          </div>

          <h1 className="text-white text-3xl md:text-5xl lg:text-[3.25rem] font-extrabold leading-tight mb-6 max-w-3xl mx-auto">
            Teste vocacional gratuito online — descubra sua carreira ideal em 2 minutos
          </h1>

          <p className="text-blue-100 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed opacity-90">
            Teste online baseado em inteligência artificial que analisa seu perfil profissional e recomenda cursos reais com alta compatibilidade.
          </p>

          <ul className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mb-10">
            {['Resultado imediato e personalizado', 'Recomendação de cursos reais', 'Gratuito e sem compromisso'].map((item) => (
              <li key={item} className="flex items-center gap-2 text-white/90 text-sm font-medium">
                <CheckIcon />
                {item}
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartQuiz}
              className="w-full sm:w-auto bg-[#FFD700] text-[#002D5E] font-extrabold text-lg px-10 py-4 rounded-xl shadow-lg shadow-black/20 hover:bg-[#E6C200] hover:scale-105 active:scale-95 transition-all min-h-[56px]"
            >
              Começar teste gratuito
            </button>
            <a
              href="https://www.cruzeiroead.com.br/graduacao"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto border-2 border-white/40 text-white font-semibold text-base px-8 py-4 rounded-xl hover:border-white/70 hover:bg-white/10 active:scale-95 transition-all min-h-[56px] flex items-center justify-center"
            >
              Ver valores dos cursos
            </a>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {[
              '100% gratuito',
              'Tempo médio 2 minutos',
              'Resultado imediato',
              'Sem compromisso'
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-[#002D5E] text-sm font-semibold">
                <CheckIcon />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Como Funciona */}
      <section className="px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[#002D5E] text-2xl md:text-4xl font-extrabold mb-3">Como funciona</h2>
            <p className="text-slate-500 text-base md:text-lg">Tempo médio de conclusão: 2 minutos</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div
                key={step.number}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[#FFD700] font-extrabold text-3xl leading-none">{step.number}</span>
                  <div className="text-[#002D5E] group-hover:text-[#FFD700] transition-colors">{step.icon}</div>
                </div>
                <h3 className="text-[#002D5E] font-bold text-lg mb-2 leading-snug">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="bg-[#002D5E] px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-white text-2xl md:text-4xl font-extrabold mb-3">O que você descobre com o teste</h2>
            <p className="text-blue-200 text-base md:text-lg">Resultado completo e personalizado para seu perfil</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {benefits.map((benefit) => (
              <div key={benefit} className="bg-white/10 border border-white/20 rounded-xl p-5 flex items-center gap-3 hover:bg-white/15 transition-colors">
                <CheckIcon />
                <span className="text-white font-medium text-base">{benefit}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <button
              onClick={onStartQuiz}
              className="bg-[#FFD700] text-[#002D5E] font-extrabold text-lg px-10 py-4 rounded-xl shadow-lg hover:bg-[#E6C200] hover:scale-105 active:scale-95 transition-all min-h-[56px]"
            >
              Descobrir meu perfil agora
            </button>
          </div>
        </div>
      </section>

      {/* Para quem é */}
      <section className="px-4 py-16 md:py-24 bg-[#f8fafc]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[#002D5E] text-2xl md:text-4xl font-extrabold mb-3">Para quem é este teste</h2>
            <p className="text-slate-500 text-base md:text-lg">Uma ferramenta de orientação profissional para todos</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {audiences.map((item) => (
              <div key={item.text} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className="bg-[#f0f6ff] rounded-xl p-3 flex-shrink-0">{item.icon}</div>
                <p className="text-slate-700 font-medium text-base leading-snug pt-1">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Confianca */}
      <section className="bg-white px-4 py-16 md:py-24 border-y border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[#002D5E] text-2xl md:text-4xl font-extrabold mb-3">Seguro, gratuito e sem compromisso</h2>
            <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto">
              Nosso teste utiliza inteligência artificial e dados reais para gerar recomendações personalizadas sobre cursos e áreas profissionais. Você pode realizar gratuitamente e sem qualquer compromisso.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustItems.map((item) => (
              <div key={item.title} className="text-center p-6 rounded-2xl bg-[#f8fafc] border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                <div className="bg-[#f0f6ff] rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="text-[#002D5E] font-bold text-base mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16 md:py-24 bg-[#f8fafc]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[#002D5E] text-2xl md:text-4xl font-extrabold mb-3">Perguntas frequentes</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50 transition-colors min-h-[44px]"
                  aria-expanded={openFaq === i}
                >
                  <span className="text-[#002D5E] font-semibold text-base pr-4">{faq.q}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
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

      {/* CTA Final */}
      <section className="bg-[#002D5E] px-4 py-16 md:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-white text-2xl md:text-4xl font-extrabold mb-4 leading-tight">
            Descubra agora sua carreira ideal
          </h2>
          <p className="text-blue-200 text-lg mb-10 opacity-90">
            Gratuito, rápido e personalizado para o seu perfil.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartQuiz}
              className="w-full sm:w-auto bg-[#FFD700] text-[#002D5E] font-extrabold text-lg px-10 py-4 rounded-xl shadow-lg hover:bg-[#E6C200] hover:scale-105 active:scale-95 transition-all min-h-[56px]"
            >
              Começar teste gratuito
            </button>
            <a
              href="https://www.cruzeiroead.com.br/graduacao"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto border-2 border-white/40 text-white font-semibold text-base px-8 py-4 rounded-xl hover:border-white/70 hover:bg-white/10 active:scale-95 transition-all min-h-[56px] flex items-center justify-center"
            >
              Ver valores dos cursos
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#001e3f] px-4 py-6">
        <div className="max-w-4xl mx-auto text-center">
          <img
            src="https://static.wixstatic.com/media/28db79_daac6eb2a3bf4e7393dd5651e96916f3~mv2.png"
            alt="Cruzeiro EAD"
            className="h-8 w-auto object-contain mx-auto mb-3 opacity-70"
            referrerPolicy="no-referrer"
          />
          <p className="text-white/40 text-xs">
            &copy; {new Date().getFullYear()} Cruzeiro EAD. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
