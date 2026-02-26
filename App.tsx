
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { WORDS, MIN_SELECTION, MAX_SELECTION } from './constants';
import WordPill from './components/WordPill';
import ResultPage from './components/ResultPage';
import LeadCaptureModal, { LeadData } from './components/LeadCaptureModal';
import LoadingScreen from './components/LoadingScreen';
import { Recommendation } from './types';
import { AnimatePresence } from 'motion/react';

const App: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [result, setResult] = useState<Recommendation | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isVocationalLoading, setIsVocationalLoading] = useState(false);
  const [leadData, setLeadData] = useState<LeadData | null>(null);
  const [hasCapturedLead, setHasCapturedLead] = useState(false);

  useEffect(() => {
    // 1. NA PÁGINA DO QUIZ (antes de abrir lightbox):
    const gclid = new URLSearchParams(window.location.search).get('gclid');
    if (gclid) {
      localStorage.setItem('gclid', gclid);
    }
  }, []);

  const toggleWord = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      }
      if (prev.length >= MAX_SELECTION) return prev;
      return [...prev, id];
    });
  };

  const handleCalculate = async () => {
    console.log('handleCalculate triggered. Selected count:', selectedIds.length);
    if (selectedIds.length < MIN_SELECTION) {
      console.log('Not enough words selected');
      return;
    }

    if (hasCapturedLead && leadData) {
      console.log('Lead already captured, skipping modal...');
      setIsVocationalLoading(true);
    } else {
      console.log('Opening Lead Modal...');
      setIsLeadModalOpen(true);
    }
  };

  const handleLeadSuccess = useCallback((data: LeadData) => {
    setLeadData(data);
    setHasCapturedLead(true);
    setIsVocationalLoading(true);
  }, []);

  const handleVocationalSuccess = useCallback((dados: Recommendation) => {
    setResult(dados);
    setIsVocationalLoading(false);
  }, []);

  const handleRedo = () => {
    setResult(null);
    setSelectedIds([]);
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
    <div className="min-h-screen flex flex-col items-center">
      {/* Hero Section */}
      <section className="custom-blue w-full pt-12 pb-16 px-4 flex flex-col items-center text-center">
        <div className="mb-8">
          {/* Official Logo from Wix URL */}
          <img 
            src="https://static.wixstatic.com/media/28db79_daac6eb2a3bf4e7393dd5651e96916f3~mv2.png" 
            alt="Cruzeiro EAD" 
            className="h-16 md:h-24 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
        </div>

        <h1 className="text-white text-3xl md:text-5xl font-extrabold max-w-2xl leading-tight mb-4">
          Descubra qual curso combina com você
        </h1>
        
        <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-lg opacity-90">
          Escolha entre <span className="text-yellow-400 font-bold">{MIN_SELECTION}</span> e <span className="text-yellow-400 font-bold">{MAX_SELECTION}</span> palavras que mais combinam com seu perfil.
        </p>

        {/* Counter Widget */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-full max-w-sm">
          <div className="flex justify-between items-end mb-3">
            <span className="text-white/60 text-sm font-medium uppercase tracking-wider">Palavras Selecionadas</span>
            <span className={`text-2xl font-bold ${selectedIds.length >= MIN_SELECTION ? 'text-yellow-400' : 'text-white'}`}>
              {selectedIds.length} <span className="text-white/40 text-lg">/ {MAX_SELECTION}</span>
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-yellow-400 transition-all duration-500 ease-out" 
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
          
          <p className="text-white/60 text-xs italic">
            {selectedIds.length < MIN_SELECTION 
              ? `Selecione mais ${MIN_SELECTION - selectedIds.length} para liberar o resultado.` 
              : "Pronto! Agora você já pode descobrir seu futuro."}
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
                group relative w-full max-w-md h-16 rounded-2xl font-extrabold text-xl shadow-lg transition-all
                ${canSubmit
                  ? 'custom-yellow text-slate-900 hover:scale-105 hover:shadow-yellow-400/20 active:scale-95'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
              `}
            >
              Ver meu resultado
              {canSubmit && (
                 <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center animate-bounce shadow-md">!</div>
              )}
            </button>
            
            <button className="mt-6 text-slate-400 hover:text-custom-blue font-medium text-sm transition-colors group flex items-center gap-1">
              Já sabe qual curso quer? <span className="underline decoration-dotted group-hover:decoration-solid">Ver preços direto</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </main>

      {/* Footer Mobile Fix */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 shadow-2xl z-40">
        <button
          onClick={handleCalculate}
          disabled={!canSubmit}
          className={`
            w-full h-14 rounded-xl font-bold transition-all flex items-center justify-center
            ${canSubmit ? 'custom-yellow text-slate-900 shadow-lg' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
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
