import React, { useState, useEffect, useRef } from 'react';
import { Star, Brain, Sparkles, RefreshCw } from 'lucide-react';
import { proxyWebhook } from '../services/api';
import { motion, AnimatePresence } from 'motion/react';

interface LoadingScreenProps {
  palavras: string[];
  userData: {
    name: string;
    phone: string;
    gclid: string | null;
  };
  onSuccess: (dados: any) => void;
  onError: (erro: any) => void;
}

const FRASES = [
  { range: [0, 20], text: "Analisando suas palavras-chave..." },
  { range: [20, 40], text: "Identificando seu perfil profissional..." },
  { range: [40, 60], text: "Mapeando cursos compatíveis..." },
  { range: [60, 80], text: "Gerando recomendações personalizadas..." },
  { range: [80, 95], text: "Preparando seu relatório completo..." },
  { range: [95, 100], text: "Pronto!" },
];

const DICAS = [
  "Alunos da Cruzeiro EAD aumentam em média 40% o salário após formar",
  "Você pode estudar 100% online ou em polos próximos à sua casa",
  "Temos bolsas de até 50% para quem se matricula este mês",
  "Mais de 500 mil alunos já escolheram a Cruzeiro do Sul",
];

const LoadingScreen: React.FC<LoadingScreenProps> = ({ palavras, userData, onSuccess, onError }) => {
  const [progress, setProgress] = useState(0);
  const [currentDicaIndex, setCurrentDicaIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const hasFetchedRef = useRef(false);
  const resultDataRef = useRef<any>(null);
  const progressIntervalRef = useRef<any>(null);
  const startTimeRef = useRef<number>(Date.now());
  const BASE_TIME = 40000; // 40 seconds

  useEffect(() => {
    if (hasFetchedRef.current || !palavras.length) return;
    hasFetchedRef.current = true;

    const callWebhook = async () => {
      setHasFetched(true);
      
      const payload = {
        palavras: palavras.join(", "),
        name: userData.name,
        whatsapp: userData.phone,
        gclid: userData.gclid
      };
      
      console.log("Iniciando fetch vocacional - timestamp:", Date.now());
      console.log("Payload:", payload);

      try {
        const data = await proxyWebhook('vocacional', payload);

        console.log("Resposta recebida com sucesso:", data);
        resultDataRef.current = data;
        setIsFinished(true);
      } catch (err) {
        console.error('Erro no webhook vocacional:', err);
        // Libera para tentar novamente em caso de erro
        hasFetchedRef.current = false;
        setHasFetched(false);
        setHasError(true);
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        onError(err);
      }
    };

    callWebhook();
  }, [palavras, userData, onError]);

  useEffect(() => {
    // Progress Logic
    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (isFinished) {
          if (prev >= 100) {
            clearInterval(progressIntervalRef.current);
            setTimeout(() => onSuccess(resultDataRef.current), 500);
            return 100;
          }
          return Math.min(prev + 5, 100);
        }

        const elapsed = Date.now() - startTimeRef.current;
        const calculatedProgress = (elapsed / BASE_TIME) * 90;
        return calculatedProgress >= 90 ? 90 : calculatedProgress;
      });
    }, 100);

    // Tips Rotation
    const tipsInterval = setInterval(() => {
      setCurrentDicaIndex(prev => (prev + 1) % DICAS.length);
    }, 4000);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      clearInterval(tipsInterval);
    };
  }, [isFinished, onSuccess]);

  const currentFrase = FRASES.find(f => progress >= f.range[0] && progress <= f.range[1])?.text || FRASES[0].text;

  if (hasError) {
    return (
      <div className="fixed inset-0 z-[10000] bg-[#0A2F5A] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full space-y-6">
          <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-8 space-y-4">
            <RefreshCw className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-white text-2xl font-bold">Ops! Algo deu errado</h2>
            <p className="text-white/70">Não conseguimos processar seu resultado no momento. Por favor, tente novamente.</p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-[#FFC107] text-[#0A2F5A] font-bold rounded-xl hover:scale-[1.02] transition-all"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[10000] bg-[#0A2F5A] flex flex-col items-center justify-center p-6 overflow-hidden"
    >
      {/* Background Particles/Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-[100px] animate-pulse delay-700" />
      </div>

      <div className="relative w-full max-w-lg space-y-12 text-center">
        {/* Animated Icon */}
        <div className="relative flex justify-center">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative z-10"
          >
            <div className="bg-white/5 p-8 rounded-full border border-white/10 backdrop-blur-sm shadow-2xl">
              <Brain className="h-16 w-16 text-[#FFC107] drop-shadow-[0_0_15px_rgba(255,193,7,0.5)]" />
            </div>
          </motion.div>
          
          {/* Sparkles around icon */}
          <motion.div
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-4 -right-4"
          >
            <Sparkles className="h-8 w-8 text-yellow-200" />
          </motion.div>
        </div>

        {/* Progress Section */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-white text-xl md:text-2xl font-bold tracking-tight">
              {currentFrase}
            </h2>
            <div className="flex items-center justify-center gap-2 text-[#FFC107] font-mono text-sm">
              <span className="animate-pulse">●</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>

          <div className="relative h-4 w-full bg-white/5 rounded-full border border-white/10 overflow-hidden shadow-inner">
            <motion.div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#FFC107] to-[#FFD54F] shadow-[0_0_20px_rgba(255,193,7,0.4)]"
              style={{ width: `${progress}%` }}
              transition={{ type: "spring", bounce: 0, duration: 0.5 }}
            />
            {/* Glossy effect on bar */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-30" />
          </div>
        </div>

        {/* Tips Section */}
        <div className="h-24 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentDicaIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl w-full"
            >
              <div className="flex items-start gap-4 text-left">
                <Star className="h-5 w-5 text-[#FFC107] shrink-0 mt-1" />
                <p className="text-white/80 text-sm md:text-base leading-relaxed">
                  {DICAS[currentDicaIndex]}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
