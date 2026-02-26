
import React from 'react';
import { Recommendation } from '../types';
import { CheckCircle2, BookOpen, User, FileText, ArrowRight } from 'lucide-react';

interface ResultModalProps {
  recommendation: Recommendation;
  onClose: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ recommendation, onClose }) => {
  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl transform transition-all animate-in zoom-in-95 fade-in duration-300 my-8">
        {/* Header */}
        <div className="bg-[#0A2F5A] p-8 md:p-12 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-yellow-400 rounded-full blur-3xl" />
          </div>
          
          <div className="relative z-10">
            <div className="w-20 h-20 bg-[#FFC107] rounded-full flex items-center justify-center mx-auto mb-6 text-[#0A2F5A] shadow-xl">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h2 className="text-yellow-400 text-sm font-bold uppercase tracking-[0.2em] mb-2">Análise Concluída</h2>
            <h3 className="text-3xl md:text-4xl font-black leading-tight">
              Perfil {recommendation.perfil_dominante}
            </h3>
          </div>
        </div>
        
        <div className="p-8 md:p-10 space-y-8">
          {/* Resumo Executivo */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-[#0A2F5A]">
              <User className="h-5 w-5" />
              <h4 className="font-bold uppercase text-xs tracking-wider">Resumo do Perfil</h4>
            </div>
            <p className="text-slate-600 text-lg leading-relaxed italic">
              "{recommendation.resumo_executivo}"
            </p>
          </section>

          {/* Cursos Recomendados */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-[#0A2F5A]">
              <BookOpen className="h-5 w-5" />
              <h4 className="font-bold uppercase text-xs tracking-wider">Cursos Ideais para Você</h4>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {recommendation.cursos_recomendados.map((item, idx) => (
                <div key={idx} className="flex flex-col p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:border-yellow-400/50 transition-all group shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm group-hover:bg-yellow-400 transition-colors">
                        <span className="text-[#0A2F5A] font-bold text-sm">{idx + 1}</span>
                      </div>
                      <h5 className="font-bold text-slate-800 text-lg">{item.curso}</h5>
                    </div>
                    {item.badge && (
                      <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div className="bg-white/50 p-2 rounded-xl text-center">
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Área</p>
                      <p className="text-xs font-semibold text-slate-600 truncate">{item.area}</p>
                    </div>
                    <div className="bg-white/50 p-2 rounded-xl text-center">
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Grau</p>
                      <p className="text-xs font-semibold text-slate-600">{item.grau}</p>
                    </div>
                    <div className="bg-white/50 p-2 rounded-xl text-center">
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Duração</p>
                      <p className="text-xs font-semibold text-slate-600">{item.semestres} sem.</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Relatório Completo */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-[#0A2F5A]">
              <FileText className="h-5 w-5" />
              <h4 className="font-bold uppercase text-xs tracking-wider">Análise Detalhada</h4>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                {recommendation.relatorio_completo}
              </p>
            </div>
          </section>
          
          {/* Actions */}
          <div className="pt-4 space-y-3">
            <button 
              onClick={() => window.open('https://ead.cruzeirodosul.edu.br/cursos/', '_blank')}
              className="w-full h-16 bg-[#FFC107] hover:bg-[#FFD54F] text-[#0A2F5A] font-black text-lg rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3 group"
            >
              Ver Preços e Bolsas
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="w-full h-14 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-500 font-bold rounded-2xl transition-all"
            >
              Refazer Teste
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
