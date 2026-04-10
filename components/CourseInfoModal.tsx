import React, { useEffect, useState } from 'react';
import { X, Briefcase, MapPin, TrendingUp, DollarSign, BookOpen, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { fetchCourseInfo, CourseInfo } from '../services/api';

interface CourseInfoModalProps {
  courseName: string;
  isOpen: boolean;
  onClose: () => void;
  onVerPreco: () => void;
}

const CourseInfoModal: React.FC<CourseInfoModalProps> = ({
  courseName,
  isOpen,
  onClose,
  onVerPreco,
}) => {
  const [info, setInfo] = useState<CourseInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!isOpen || !courseName) return;

    setLoading(true);
    setInfo(null);
    setNotFound(false);

    fetchCourseInfo(courseName)
      .then((data) => {
        if (data) {
          setInfo(data);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [isOpen, courseName]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10002] flex items-end sm:items-center justify-center p-0 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="relative w-full sm:max-w-2xl max-h-[92vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#0A2F5A] px-6 py-5 flex items-start justify-between shrink-0">
              <div>
                <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-1">
                  Informações do Curso
                </p>
                <h2 className="text-white text-xl font-black leading-tight pr-8">
                  {courseName}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1 p-6 space-y-6">
              {loading && (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <div className="w-10 h-10 border-4 border-[#0A2F5A]/20 border-t-[#0A2F5A] rounded-full animate-spin" />
                  <p className="text-slate-500 text-sm">Carregando informações...</p>
                </div>
              )}

              {notFound && !loading && (
                <div className="text-center py-12">
                  <p className="text-slate-500 text-base">Informações detalhadas não disponíveis para este curso.</p>
                </div>
              )}

              {info && !loading && (
                <>
                  {/* Sobre o curso */}
                  <div className="bg-slate-50 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 bg-[#0A2F5A]/10 rounded-lg">
                        <BookOpen className="h-4 w-4 text-[#0A2F5A]" />
                      </div>
                      <h3 className="text-[#0A2F5A] font-bold text-sm uppercase tracking-wide">Sobre o Curso</h3>
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed">{info.sobre_o_curso}</p>
                    <div className="flex flex-wrap gap-3 mt-4">
                      {info.grau && (
                        <span className="bg-[#0A2F5A]/10 text-[#0A2F5A] text-xs font-semibold px-3 py-1 rounded-full">
                          {info.grau}
                        </span>
                      )}
                      {info.modalidade && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
                          {info.modalidade}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Faixa salarial */}
                  {info.faixa_salarial && (
                    <div className="bg-green-50 rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 bg-green-600/10 rounded-lg">
                          <DollarSign className="h-4 w-4 text-green-700" />
                        </div>
                        <h3 className="text-green-800 font-bold text-sm uppercase tracking-wide">Faixa Salarial</h3>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center">
                          <p className="text-green-600 text-[10px] font-bold uppercase mb-1">Início</p>
                          <p className="text-green-800 text-xs font-semibold">{info.faixa_salarial.inicio}</p>
                        </div>
                        <div className="text-center border-x border-green-200">
                          <p className="text-green-600 text-[10px] font-bold uppercase mb-1">Médio</p>
                          <p className="text-green-800 text-xs font-semibold">{info.faixa_salarial.medio}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-green-600 text-[10px] font-bold uppercase mb-1">Especialista</p>
                          <p className="text-green-800 text-xs font-semibold">{info.faixa_salarial.especialista}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Carreiras e Áreas */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {info.carreiras_possiveis?.length > 0 && (
                      <div className="bg-blue-50 rounded-2xl p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-1.5 bg-blue-600/10 rounded-lg">
                            <Briefcase className="h-4 w-4 text-blue-700" />
                          </div>
                          <h3 className="text-blue-800 font-bold text-sm uppercase tracking-wide">Carreiras</h3>
                        </div>
                        <ul className="space-y-1.5">
                          {info.carreiras_possiveis.map((c, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-blue-400 mt-1 shrink-0">▸</span>
                              <span className="text-blue-900 text-xs">{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {info.areas_de_atuacao?.length > 0 && (
                      <div className="bg-purple-50 rounded-2xl p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-1.5 bg-purple-600/10 rounded-lg">
                            <MapPin className="h-4 w-4 text-purple-700" />
                          </div>
                          <h3 className="text-purple-800 font-bold text-sm uppercase tracking-wide">Áreas</h3>
                        </div>
                        <ul className="space-y-1.5">
                          {info.areas_de_atuacao.map((a, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-purple-400 mt-1 shrink-0">▸</span>
                              <span className="text-purple-900 text-xs">{a}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Mercado de trabalho */}
                  {info.mercado_de_trabalho?.length > 0 && (
                    <div className="bg-orange-50 rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 bg-orange-600/10 rounded-lg">
                          <TrendingUp className="h-4 w-4 text-orange-700" />
                        </div>
                        <h3 className="text-orange-800 font-bold text-sm uppercase tracking-wide">Mercado de Trabalho</h3>
                      </div>
                      <ul className="space-y-1.5">
                        {info.mercado_de_trabalho.map((m, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-orange-400 mt-1 shrink-0">▸</span>
                            <span className="text-orange-900 text-xs">{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Perfil */}
                  {info.perfil && (
                    <div className="bg-[#0A2F5A]/5 rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 bg-[#0A2F5A]/10 rounded-lg">
                          <User className="h-4 w-4 text-[#0A2F5A]" />
                        </div>
                        <h3 className="text-[#0A2F5A] font-bold text-sm uppercase tracking-wide">Perfil Ideal</h3>
                      </div>
                      <p className="text-slate-700 text-sm leading-relaxed italic">"{info.perfil}"</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer CTA */}
            <div className="shrink-0 px-6 pb-6 pt-4 border-t border-slate-100 bg-white">
              <button
                onClick={onVerPreco}
                className="w-full py-4 bg-[#FFC107] hover:bg-[#FFD54F] text-[#0A2F5A] font-black rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-base"
              >
                <span className="text-xl">🗨️</span>
                Quero saber o preço
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CourseInfoModal;
