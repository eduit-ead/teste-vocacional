import React from 'react';
import { X } from 'lucide-react';
import Markdown from 'react-markdown';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const privacyPolicyContent = `
# Política de Privacidade

A sua privacidade é importante para nós. É política do EduIT respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site EduIT, e outros sites que possuímos e operamos.

Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.

Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis ​​para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.

Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei.

O nosso site pode ter links para sites externos que não são operados por nós. Esteja ciente de que não temos controle sobre o conteúdo e práticas desses sites e não podemos aceitar responsabilidade por suas respectivas políticas de privacidade.

Você é livre para recusar a nossa solicitação de informações pessoais, entendendo que talvez não possamos fornecer alguns dos serviços desejados.

O uso continuado de nosso site será considerado como aceitação de nossas práticas em torno de privacidade e informações pessoais. Se você tiver alguma dúvida sobre como lidamos com dados do usuário e informações pessoais, entre em contacto connosco.

## Compromisso do Usuário

O usuário se compromete a fazer uso adequado dos conteúdos e da informação que o EduIT oferece no site e com caráter enunciativo, mas não limitativo:

*   A) Não se envolver em atividades que sejam ilegais ou contrárias à boa fé a à ordem pública;
*   B) Não difundir propaganda ou conteúdo de natureza racista, xenofóbica, ou sobre cassinos, casas de apostas online, qualquer tipo de pornografia ilegal, de apologia ao terrorismo ou contra os direitos humanos;
*   C) Não causar danos aos sistemas físicos (hardware) e lógicos (software) do EduIT, de seus fornecedores ou terceiros, para introduzir ou disseminar vírus informáticos ou quaisquer outros sistemas de hardware ou software que sejam capazes de causar danos anteriormente mencionados.

## Mais informações

Esperemos que esteja esclarecido e, como mencionado anteriormente, se houver algo que você não tem certeza se precisa ou não, geralmente é mais seguro deixar os cookies ativados, caso interaja com um dos recursos que você usa em nosso site.

Esta política é efetiva a partir de **Janeiro/2024**.
`;

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-slate-900 text-xl font-bold">Política de Privacidade</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto prose prose-slate max-w-none">
          <div className="markdown-body">
            <Markdown>{privacyPolicyContent}</Markdown>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-[#0A2F5A] text-white font-bold rounded-xl hover:bg-[#0A2F5A]/90 transition-all"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
