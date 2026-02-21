
import React from 'react';
import { Recommendation } from '../types';

interface ResultModalProps {
  recommendation: Recommendation;
  onClose: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ recommendation, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl transform transition-all animate-in zoom-in-95 fade-in duration-300">
        <div className="custom-blue p-8 text-white text-center">
          <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-sm font-bold uppercase tracking-widest opacity-80 mb-1">Resultado do seu Perfil</h2>
          <h3 className="text-3xl font-extrabold leading-tight">{recommendation.course}</h3>
        </div>
        
        <div className="p-8">
          <p className="text-slate-600 text-lg leading-relaxed mb-6">
            {recommendation.reason}
          </p>
          
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-8">
            <h4 className="font-bold text-slate-900 mb-2">Sobre o curso:</h4>
            <p className="text-slate-500">{recommendation.description}</p>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={() => window.location.reload()}
              className="w-full h-14 custom-yellow hover-custom-yellow text-slate-900 font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center"
            >
              Começar de Novo
            </button>
            <button 
              onClick={onClose}
              className="w-full h-14 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-600 font-semibold rounded-xl transition-all"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
