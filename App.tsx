
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { WORDS, MIN_SELECTION, MAX_SELECTION } from './constants';
import WordPill from './components/WordPill';
import ResultPage from './components/ResultPage';
import LeadCaptureModal, { LeadData } from './components/LeadCaptureModal';
import LoadingScreen from './components/LoadingScreen';
import { Recommendation } from './types';
import { AnimatePresence } from 'motion/react';
import { trackEvent } from './services/tracking';

const COURSES_URL = 'https://www.cruzeiroead.com.br/graduacao';

function loadSessionData<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const App: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [result, setResult] = useState<Recommendation | null>(() => loadSessionData('quiz_result'));
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isVocationalLoading, setIsVocationalLoading] = useState(false);
  const [leadData, setLeadData] = useState<LeadData | null>(() => loadSessionData('quiz_lead'));
  const [hasCapturedLead, setHasCapturedLead] = useState(() => !!loadSessionData('quiz_lead'));

  useEffect(() => {
    const gclid = new URLSearchParams(window.location.search).get('gclid');
    if (gclid) {
      localStorage.setItem('gclid', gclid);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleWord = (id: string) => {
    const word = WORDS.find(w => w.id === id);

    if (selectedIds.includes(id)) {
      const next = selectedIds.filter(i => i !== id);
      setSelectedIds(next);
      if (word) trackEvent('word_unselected', { word: word.label, selected_count: next.length });
    } else {
      if (selectedIds.length >= MAX_SELECTION) return;
      const next = [...selectedIds, id];
      setSelectedIds(next);
      if (word) trackEvent('word_selected', { word: word.label, selected_count: next.length });
    }
  };

  const handleCalculate = async () => {
    if (selectedIds.length < MIN_SELECTION) return;

    trackEvent('quiz_submit', {
      words: selectedWords,
      total_words: selectedIds.length,
    });

    if (hasCapturedLead && leadData) {
      setIsVocationalLoading(true);
    } else {
      setIsLeadModalOpen(true);
    }
  };

  const handleLeadSuccess = useCallback((data: LeadData) => {
    setLeadData(data);
    setHasCapturedLead(true);
    setIsVocationalLoading(true);
    sessionStorage.setItem('quiz_lead', JSON.stringify(data));
  }, []);

  const handleVocationalSuccess = useCallback((dados: Recommendation) => {
    setResult(dados);
    setIsVocationalLoading(false);
    sessionStorage.setItem('quiz_result', JSON.stringify(dados));
  }, []);

  const handleRedo = () => {
    setResult(null);
    setSelectedIds([]);
    sessionStorage.removeItem('quiz_result');
    sessionStorage.removeItem('quiz_lead');
  };

  const canSubmit = selectedIds.length >= MIN_SELECTION;
  const progressPercentage = (selectedIds.length / MIN_SELECTION) * 100;

  const selectedWords = useMemo(() => WORDS
    .filter(w => selectedIds.includes(w.id))
    .map(w => w.label), [selectedIds]);

  const userDataForLoading = useMemo(() => leadData ? {
    name: leadData.name,
    phone: leadData.phone,
    gclid: leadData.gclid
  } : null, [leadData]);

  if (result && leadData) {
    return (
      <ResultPage
        recommendation={result}
        userData={{
          name: leadData.name,
          phone: leadData.phone,
          gclid: leadData.gclid
        }}
        onRedo={handleRedo}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-slate-50" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Quiz hero — imersivo, sem header/nav */}
      <section id="quiz" className="custom-blue w-full pt-10 pb-14 px-4 flex flex-col items-center text-center">

        {/* Logo Cruzeiro EAD — SVG nativo, sem rasterização */}
        <div className="mb-8 flex items-center justify-center">
          <img
            src="https://static.wixstatic.com/media/a9822b_f8f6943da75645e7912e3c38711fe5e5~mv2.png/v1/fill/w_446,h_120,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/a9822b_f8f6943da75645e7912e3c38711fe5e5~mv2.png"
            alt="Cruzeiro EAD — Ensino Superior EAD"
            style={{
              width: 'clamp(160px, 20vw, 220px)',
              height: 'auto',
              objectFit: 'contain',
              display: 'block',
            }}
            referrerPolicy="no-referrer"
            decoding="async"
            draggable={false}
          />
        </div>

        <h1 className="text-white text-2xl md:text-4xl font-extrabold max-w-2xl leading-tight mb-3">
          Veja qual curso combina com você
        </h1>

        <p className="text-blue-100 text-base md:text-lg mb-8 max-w-lg opacity-90">
          Escolha de <span className="text-yellow-400 font-bold">{MIN_SELECTION}</span> a{' '}
          <span className="text-yellow-400 font-bold">{MAX_SELECTION}</span> palavras que tenham a ver com você.
        </p>

        {/* Counter Widget */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 w-full max-w-sm">
          <div className="flex justify-between items-end mb-3">
            <span className="text-white/60 text-sm font-medium uppercase tracking-wider">Palavras Selecionadas</span>
            <span className={`text-2xl font-bold ${selectedIds.length >= MIN_SELECTION ? 'text-yellow-400' : 'text-white'}`}>
              {selectedIds.length} <span className="text-white/40 text-lg">/ {MAX_SELECTION}</span>
            </span>
          </div>

          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-yellow-400 transition-all duration-500 ease-out"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>

          <p className="text-white/60 text-xs italic">
            {selectedIds.length < MIN_SELECTION
              ? `Selecione mais ${MIN_SELECTION - selectedIds.length} para liberar o resultado.`
              : 'Pronto! Agora você já pode descobrir seu futuro.'}
          </p>
        </div>
      </section>

      {/* Grid Section */}
      <main className="w-full max-w-[900px] px-4 -mt-8 pb-32">
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {WORDS.map(word => (
              <WordPill
                key={word.id}
                word={word}
                isSelected={selectedIds.includes(word.id)}
                onToggle={toggleWord}
                disabled={selectedIds.length >= MAX_SELECTION}
              />
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center">
            <button
              onClick={handleCalculate}
              disabled={!canSubmit}
              className={`
                group relative w-full max-w-md h-16 rounded-2xl font-extrabold text-xl shadow-lg transition-all duration-200
                ${canSubmit
                  ? 'custom-yellow text-slate-900 hover:scale-[1.03] hover:shadow-yellow-400/20 active:scale-95'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
              `}
            >
              Ver meu resultado
              {canSubmit && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center animate-bounce shadow-md">!</div>
              )}
            </button>

            <a
              href={COURSES_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('courses_direct_click', { origin: 'quiz_page' })}
              className="mt-6 text-slate-400 hover:text-[#002D5E] font-medium text-sm transition-colors group flex items-center gap-1"
            >
              Já sabe qual curso quer?{' '}
              <span className="underline decoration-dotted group-hover:decoration-solid">Ver preços direto</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </main>

      {/* Mobile sticky CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 shadow-[0_-4px_16px_rgba(0,0,0,0.10)] z-40">
        <button
          onClick={handleCalculate}
          disabled={!canSubmit}
          className={`
            w-full h-14 rounded-xl font-bold transition-all duration-200 flex items-center justify-center
            ${canSubmit ? 'custom-yellow text-slate-900 shadow-lg hover:scale-[1.03] active:scale-95' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
          `}
        >
          {canSubmit ? 'Ver meu resultado' : `Escolha mais ${MIN_SELECTION - selectedIds.length}`}
        </button>
      </div>

      <LeadCaptureModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        onSuccess={handleLeadSuccess}
        pageTitle="Descubra seu Curso | Perfil Profissional"
      />

      <AnimatePresence>
        {isVocationalLoading && userDataForLoading && (
          <LoadingScreen
            palavras={selectedWords}
            userData={userDataForLoading}
            onSuccess={handleVocationalSuccess}
            onError={(err) => {
              console.error(err);
              setIsVocationalLoading(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
