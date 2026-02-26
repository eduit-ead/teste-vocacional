import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { proxyWebhook } from '../services/api';
import { 
  CheckCircle2, 
  BookOpen, 
  FileText, 
  RotateCcw, 
  ChevronRight,
  Info,
  X,
  TrendingUp,
  Target,
  Lightbulb,
  Users,
  LineChart,
  Mic2,
  Search,
  Rocket,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Recommendation, RecommendedCourse, RankedArea } from '../types';

interface ResultPageProps {
  recommendation: Recommendation;
  userData: {
    name: string;
    phone: string;
    gclid: string | null;
  };
  onRedo: () => void;
}

const WHATSAPP_NUMERO = "5511917479873";

const ProfileIllustration: React.FC<{ profile: string }> = ({ profile }) => {
  const iconProps = { size: 80, strokeWidth: 1.5, className: "text-yellow-400" };
  
  switch (profile) {
    case "Executor": return <TrendingUp {...iconProps} />;
    case "Estratégico": return <Target {...iconProps} />;
    case "Criativo": return <Lightbulb {...iconProps} />;
    case "Social": return <Users {...iconProps} />;
    case "Analítico": return <LineChart {...iconProps} />;
    case "Comunicador": return <Mic2 {...iconProps} />;
    case "Investigativo": return <Search {...iconProps} />;
    case "Empreendedor": return <Rocket {...iconProps} />;
    default: return <BookOpen {...iconProps} />;
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const AreasChart: React.FC<{ areas?: RankedArea[] }> = ({ areas }) => {
  if (!areas || areas.length === 0) return null;

  // Mostrar apenas os 3 primeiros
  const top3Areas = areas.slice(0, 3);
  const maxScore = Math.max(...top3Areas.map(a => a.score));

  const getBarColor = (index: number) => {
    if (index === 0) return '#FFC107';
    if (index === 1) return '#4A90D9';
    return '#B8D4E8';
  };

  return (
    <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] shadow-xl p-8 md:p-12 mb-12 border border-slate-100">
      <div className="space-y-8">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 text-[#0A2F5A]">
            <div className="p-2 bg-blue-50 rounded-lg">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-black">Suas Áreas de Destaque</h2>
          </div>
          <p className="text-slate-500 text-sm ml-14">Baseado nas palavras que você escolheu</p>
        </div>

        <div className="space-y-6">
          {top3Areas.map((area, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="w-32 md:w-44 shrink-0">
                <span className="text-base font-bold text-[#0A2F5A]">{area.area}</span>
              </div>
              <div className="flex-1 h-8 bg-slate-50 rounded-lg overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(area.score / maxScore) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  style={{ backgroundColor: getBarColor(idx) }}
                  className="h-full rounded-lg"
                />
              </div>
              <div className="w-10 text-right">
                <span className="text-base font-black text-[#0A2F5A]">{area.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const ResultPage: React.FC<ResultPageProps> = ({ recommendation, userData, onRedo }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  function limparNomeCurso(nome: string) {
    return nome
      .replace(/\s*-\s*EAD$/i, '')
      .replace(/\s*-\s*Semipresencial$/i, '')
      .replace(/\s*-\s*Presencial$/i, '')
      .replace(/\s*-\s*Online$/i, '')
      .trim();
  }

  const resumoLimpo = recommendation.resumo_executivo
    .replace(/^["']|["']$/g, '')           // remove aspas
    .replace(/#+$/, '')                     // remove # final
    .replace(/^\*\*RESUMO EXECUTIVO\*\*\s*/i, '') // remove **RESUMO EXECUTIVO**
    .replace(/^\*\*|\*\*$/g, '')            // remove ** soltos
    .replace(/---+$/, '')                   // remove --- do final
    .replace(/-+$/, '')                     // remove - sobrando
    .trim();

  const handleCourseClick = async (course: RecommendedCourse, position: number) => {
    console.log("Clicou curso:", course.curso);
    
    // 1. Gravar no CRM via Proxy
    try {
      await proxyWebhook('atualiza-lead', {
        whatsapp: userData.phone,
        curso_clicado: course.curso,
        posicao_ranking: position,
        perfil: recommendation.perfil_dominante,
        acao: "interesse_curso_especifico",
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error('Erro ao atualizar CRM via proxy:', err);
    }

    // 2. Abrir WhatsApp
    const mensagem = `Olá! Meu teste vocacional indicou o curso *${course.curso}* (perfil: ${recommendation.perfil_dominante}). Quero saber valores e condições especiais.`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleConsultantClick = () => {
    const message = `Olá! Fiz o teste vocacional e meu perfil foi *${recommendation.perfil_dominante}*. Estou em dúvida entre alguns cursos e preciso de ajuda para decidir.`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleModalWhatsAppClick = () => {
    const message = `Olá! Fiz o teste vocacional e meu perfil foi *${recommendation.perfil_dominante}*. Quero entender melhor minha análise e os cursos recomendados.`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-[#F8F9FA] pb-20"
    >
      {/* Hero Section */}
      <section className="bg-[#0A2F5A] pt-12 pb-24 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-yellow-400 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-64 h-64 bg-blue-400 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="mb-10">
            <img 
              src="https://static.wixstatic.com/media/28db79_daac6eb2a3bf4e7393dd5651e96916f3~mv2.png" 
              alt="Cruzeiro EAD" 
              className="h-12 md:h-16 mx-auto"
            />
          </div>
          
          <motion.div variants={itemVariants} className="mb-8 flex flex-col items-center">
            <div className="mb-6 p-6 bg-white/5 rounded-full backdrop-blur-sm border border-white/10 shadow-2xl">
              <ProfileIllustration profile={recommendation.perfil_dominante} />
            </div>
            <p className="text-white/60 uppercase tracking-[0.2em] font-bold text-sm mb-2">Seu perfil é</p>
            <h1 className="text-white text-4xl md:text-7xl font-black leading-tight mb-4 uppercase tracking-tight">
              {recommendation.perfil_dominante}
            </h1>
            
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/30 px-4 py-1.5 rounded-full">
              <CheckCircle2 className="h-4 w-4 text-yellow-400" />
              <span className="text-yellow-400 text-xs font-black uppercase tracking-widest">Análise Concluída</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 -mt-12 relative z-20">
        {/* Resumo do Perfil Card */}
        <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] shadow-xl p-8 md:p-12 mb-12 border border-slate-100">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-[#0A2F5A]">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Info className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-black">Resumo do Perfil</h2>
            </div>
            
            <p className="text-[#333] text-[16px] leading-[1.6] font-normal break-words max-w-full">
              {resumoLimpo}
            </p>

            <div className="flex justify-end">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1 text-[#0A2F5A] font-bold hover:underline transition-all group text-sm"
              >
                Ver análise completa
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>

        <AreasChart areas={recommendation.areas_rankeadas} />

        {/* Cursos Recomendados Section */}
        <section className="space-y-8 mb-16">
          <div className="flex items-center gap-3 text-[#0A2F5A] mb-8">
            <BookOpen className="h-7 w-7" />
            <h2 className="text-3xl font-black">Cursos Recomendados</h2>
          </div>

          {/* Linha 1: Destaques */}
          <div className="flex flex-col md:flex-row gap-6">
            {recommendation.cursos_recomendados.slice(0, 2).map((curso, idx) => (
              <motion.div 
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className={`flex flex-col p-8 rounded-[2rem] shadow-lg transition-all border-2 ${
                  idx === 0 
                    ? 'md:w-[60%] border-yellow-400 bg-yellow-50/30' 
                    : 'md:w-[40%] border-slate-100 bg-white'
                }`}
              >
                <div className="mb-6">
                  <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-4 ${
                    idx === 0 ? 'bg-yellow-400 text-[#0A2F5A]' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {idx === 0 ? "⭐ Mais alinhado ao seu perfil" : (curso.badge || "🎯 Alta empregabilidade")}
                  </span>
                  <h3 className={`font-black leading-tight mb-2 ${idx === 0 ? 'text-3xl' : 'text-2xl'}`}>
                    {limparNomeCurso(curso.curso)}
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-slate-500 text-sm font-medium">
                    <span className="flex items-center gap-1"><ChevronRight className="h-3 w-3" /> {curso.area}</span>
                    <span className="flex items-center gap-1"><ChevronRight className="h-3 w-3" /> {curso.grau}</span>
                    <span className="flex items-center gap-1"><ChevronRight className="h-3 w-3" /> {curso.semestres} semestres</span>
                  </div>
                </div>

                <div className="mt-auto">
                  <button 
                    onClick={() => handleCourseClick(curso, idx + 1)}
                    className="w-full py-4 bg-[#FFC107] hover:bg-[#FFD54F] text-[#0A2F5A] font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group"
                  >
                    <span className="text-xl">🗨️</span>
                    Quero saber o preço
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Linha 2: Compactos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {recommendation.cursos_recomendados.slice(2, 5).map((curso, idx) => (
              <motion.div 
                key={idx + 2}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-[1.5rem] shadow-md border border-slate-100 flex flex-col"
              >
                <h4 className="font-bold text-xl mb-3 text-slate-800">{limparNomeCurso(curso.curso)}</h4>
                <div className="space-y-1 mb-6">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">{curso.area} | {curso.grau}</p>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">{curso.semestres} semestres</p>
                </div>
                <button 
                  onClick={() => handleCourseClick(curso, idx + 3)}
                  className="mt-auto w-full py-3 border-2 border-[#FFC107] text-[#0A2F5A] font-bold rounded-xl hover:bg-[#FFC107] transition-all flex items-center justify-center gap-2"
                >
                  <span className="text-lg">🗨️</span>
                  Ver preço
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Próximos Passos Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <motion.div 
            variants={itemVariants}
            className="bg-[#0A2F5A] p-8 rounded-[2rem] text-white flex flex-col items-center text-center space-y-4 shadow-xl"
          >
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-2">
              <span className="text-3xl">🗨️</span>
            </div>
            <h3 className="text-2xl font-black">Falar com consultor</h3>
            <p className="text-white/70 text-sm">Estou em dúvida entre os cursos recomendados e preciso de ajuda.</p>
            <button 
              onClick={handleConsultantClick}
              className="w-full py-4 bg-[#FFC107] text-[#0A2F5A] font-black rounded-xl hover:bg-yellow-400 transition-all shadow-lg"
            >
              Chamar no WhatsApp
            </button>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="bg-white p-8 rounded-[2rem] border-2 border-slate-100 flex flex-col items-center text-center space-y-4 shadow-lg"
          >
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-2">
              <RotateCcw className="h-8 w-8 text-[#0A2F5A]" />
            </div>
            <h3 className="text-2xl font-black text-[#0A2F5A]">Refazer teste</h3>
            <p className="text-slate-500 text-sm">Quero escolher outras palavras e ver novas recomendações.</p>
            <button 
              onClick={onRedo}
              className="w-full py-4 border-2 border-[#0A2F5A] text-[#0A2F5A] font-black rounded-xl hover:bg-[#0A2F5A] hover:text-white transition-all"
            >
              Refazer agora
            </button>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="flex flex-col items-center gap-6 pt-12 border-t border-slate-200">
          <p className="text-slate-400 text-sm font-medium">© 2026 CruzeiroEAD. Todos os direitos reservados</p>
        </footer>
      </div>

      {/* Modal de Análise Completa */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[10001] flex items-center justify-center p-0 md:p-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-3xl h-full md:h-auto md:max-h-[90vh] bg-white md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="bg-[#0A2F5A] p-6 md:p-8 text-white flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-yellow-400" />
                  <h3 className="text-xl font-black">Análise Completa do Perfil</h3>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-8 md:p-12 overflow-y-auto flex-1">
                <div className="markdown-body max-w-[600px] mx-auto">
                  <ReactMarkdown>
                    {recommendation.relatorio_completo}
                  </ReactMarkdown>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-100 max-w-[600px] mx-auto">
                  <button 
                    onClick={handleModalWhatsAppClick}
                    className="w-full py-5 bg-[#FFC107] text-[#0A2F5A] font-black rounded-2xl shadow-lg flex items-center justify-center gap-3 hover:scale-[1.02] transition-all"
                  >
                    <span className="text-2xl">🗨️</span>
                    Falar sobre meu perfil no WhatsApp
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ResultPage;
