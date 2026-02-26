import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { proxyWebhook } from '../services/api';
import PrivacyPolicyModal from './PrivacyPolicyModal';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: LeadData) => void;
  pageTitle: string;
}

export interface LeadData {
  name: string;
  phone: string;
  gclid: string | null;
  page: string;
  origin: string;
  lgpd: boolean;
}

const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({ isOpen, onClose, onSuccess, pageTitle }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<LeadData>({
    defaultValues: {
      origin: 'quiz_result',
      page: pageTitle,
      phone: '',
      lgpd: true // Deixa o botão da lgpd já clicado como padrão
    }
  });

  const phoneValue = watch('phone');

  // Manual phone mask: (99) 99999-9999
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    let formatted = value;
    if (value.length > 0) {
      formatted = `(${value.slice(0, 2)}`;
      if (value.length > 2) {
        formatted += `) ${value.slice(2, 7)}`;
        if (value.length > 7) {
          formatted += `-${value.slice(7, 11)}`;
        }
      }
    }
    setValue('phone', formatted);
  };

  useEffect(() => {
    if (isOpen) {
      console.log('LeadCaptureModal is now OPEN');
      // 2. NO LIGHTBOX (ao enviar formulário): Recuperar do localStorage
      const gclid = localStorage.getItem('gclid');
      setValue('gclid', gclid);
    }
  }, [isOpen, setValue]);

  // Progress bar animation during loading
  useEffect(() => {
    let interval: any;
    if (loading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) return prev;
          return prev + Math.random() * 10;
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [loading]);

  if (!isOpen) return null;

  const onSubmit = async (data: LeadData) => {
    console.log('Submitting lead data:', data);
    setLoading(true);
    setError(null);

    // Clean phone number (only numbers)
    const cleanPhone = data.phone.replace(/\D/g, '');

    // GTM Event
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'quiz_event',
        category: 'Form Submission',
        action: 'Click',
        label: 'Quiz Whats Lead'
      });
    }

    try {
      // PAYLOAD ESPERADO PELO N8N
      const payload = {
        name: data.name,
        whatsapp: cleanPhone,
        gclid: data.gclid,
        page: "Descubra seu Curso | Perfil Profissional",
        origin: "quiz_result",
        lgpd: data.lgpd
      };

      const data = await proxyWebhook('valida-vocacional', payload);

      console.log('Webhook response:', data);

      if (data.whatsapp_valido === true) {
        // Sucesso - segue para resultado
        setProgress(100);
        setTimeout(() => {
          onSuccess({ ...data, phone: cleanPhone });
          setLoading(false);
          onClose();
        }, 500);
      } else if (data.whatsapp_valido === false) {
        // WhatsApp inválido
        setError("Esse número não possui WhatsApp ativo. Verifique o número digitado.");
        setLoading(false);
      } else {
        // Resposta inesperada
        setError("Erro na validação. Tente novamente.");
        setLoading(false);
      }
    } catch (err) {
      console.error('Validation error:', err);
      setError("Erro ao validar. Tente novamente em alguns segundos.");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <div className="relative w-full max-w-md bg-[#0A2F5A] rounded-3xl shadow-2xl overflow-hidden border border-white/10">
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors z-10"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="p-8 md:p-10">
            <div className="text-center mb-8">
              <h2 className="text-white text-2xl font-bold leading-tight mb-2">
                Estamos finalizando seu resultado personalizado!
              </h2>
              <p className="text-[#FFD700] font-medium">
                Digite seus dados para liberar sua análise
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name Field */}
              <div>
                <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-1.5 ml-1">
                  Nome Completo*
                </label>
                <input
                  {...register('name', { required: 'Nome é obrigatório' })}
                  type="text"
                  placeholder="Seu nome aqui"
                  className={`w-full h-12 px-4 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#FFD700] outline-none transition-all ${errors.name ? 'border-2 border-red-500' : ''}`}
                />
                {errors.name && <span className="text-red-400 text-xs mt-1 ml-1">{errors.name.message}</span>}
              </div>

              {/* WhatsApp Field */}
              <div>
                <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-1.5 ml-1">
                  WhatsApp*
                </label>
                <input
                  type="text"
                  placeholder="(00) 00000-0000"
                  value={phoneValue}
                  onChange={handlePhoneChange}
                  className={`w-full h-12 px-4 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#FFD700] outline-none transition-all ${errors.phone ? 'border-2 border-red-500' : ''}`}
                />
                <input 
                  type="hidden" 
                  {...register('phone', { 
                    required: 'WhatsApp é obrigatório',
                    validate: (val) => val.replace(/\D/g, '').length >= 10 || 'Número inválido'
                  })} 
                />
                {errors.phone && <span className="text-red-400 text-xs mt-1 ml-1">{errors.phone.message}</span>}
              </div>

              {/* LGPD Checkbox */}
              <div className="flex items-start gap-3 py-2">
                <input
                  {...register('lgpd', { required: true })}
                  type="checkbox"
                  id="lgpd"
                  className="mt-1 w-4 h-4 rounded border-white/20 bg-white/10 text-[#FFD700] focus:ring-[#FFD700]"
                />
                <label htmlFor="lgpd" className="text-white/70 text-xs leading-relaxed cursor-pointer">
                  Li e concordo com os termos da <button type="button" onClick={() => setIsPrivacyOpen(true)} className="text-[#FFD700] underline hover:text-[#FFD700]/80">Política de Privacidade</button>
                </label>
              </div>
              {errors.lgpd && <p className="text-red-400 text-[10px] -mt-2 ml-7">Você precisa aceitar os termos para continuar.</p>}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full h-14 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center
                  ${loading 
                    ? 'bg-slate-600 text-white/50 cursor-not-allowed' 
                    : 'bg-[#FFD700] text-[#0A2F5A] hover:scale-[1.02] active:scale-[0.98] hover:shadow-[#FFD700]/20'
                  }`}
              >
                {loading ? 'Processando...' : 'Liberar meu Resultado'}
              </button>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
                  <p className="text-red-400 text-sm font-medium">{error}</p>
                </div>
              )}
            </form>

            {/* Loading Overlay */}
            {loading && (
              <div className="mt-6 space-y-3">
                <p className="text-white/60 text-xs text-center italic">
                  Estamos validando seu WhatsApp...
                </p>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#FFD700] transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <PrivacyPolicyModal 
        isOpen={isPrivacyOpen} 
        onClose={() => setIsPrivacyOpen(false)} 
      />
    </>
  );
};

export default LeadCaptureModal;

