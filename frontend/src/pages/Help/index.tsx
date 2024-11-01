// src/pages/Help/index.tsx
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion';
import { HelpCircle, Mail, Phone, Clock, MapPin } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'Como cadastrar um novo cliente?',
    answer: 'Para cadastrar um novo cliente, acesse o menu "Cadastros" > "Clientes" e clique no botão "Novo Cliente". Preencha os campos necessários e clique em "Salvar".'
  },
  {
    question: 'Como importar clientes em massa?',
    answer: 'Na tela de listagem de clientes, clique no botão "Importar". Selecione um arquivo CSV com os dados dos clientes seguindo o modelo fornecido.'
  },
  {
    question: 'Como gerar um orçamento?',
    answer: 'Acesse o menu "Comercial" > "Orçamento" e clique em "Novo Orçamento". Selecione o cliente, adicione os itens desejados e configure as condições comerciais.'
  },
  {
    question: 'Como gerenciar impostos?',
    answer: 'No menu "Cadastros" > "Impostos", você pode visualizar, adicionar, editar e excluir impostos que serão utilizados nos cálculos de orçamentos e contratos.'
  }
];

const Help: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Cabeçalho */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <HelpCircle className="h-12 w-12 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Central de Ajuda</h1>
        <p className="text-gray-600">
          Encontre respostas para suas dúvidas e aprenda a usar todas as funcionalidades do sistema.
        </p>
      </div>

      {/* Seção de Contato */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Contato do Suporte</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 text-gray-600">
            <Mail className="h-5 w-5 text-emerald-600" />
            <span>suporte@sipreciconts.com</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-600">
            <Phone className="h-5 w-5 text-emerald-600" />
            <span>(11) 9999-9999</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-600">
            <Clock className="h-5 w-5 text-emerald-600" />
            <span>Seg - Sex: 9:00 - 18:00</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-600">
            <MapPin className="h-5 w-5 text-emerald-600" />
            <span>São Paulo, SP</span>
          </div>
        </div>
      </div>

      {/* Seção de FAQ */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Perguntas Frequentes</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Links Úteis */}
      <div className="mt-8 text-center text-sm text-gray-600">
        <p>
          Precisa de mais ajuda? Consulte nossa{' '}
          <a 
            href="#" 
            className="text-emerald-600 hover:text-emerald-700 underline"
            onClick={(e) => e.preventDefault()}
          >
            documentação completa
          </a>{' '}
          ou{' '}
          <a 
            href="#" 
            className="text-emerald-600 hover:text-emerald-700 underline"
            onClick={(e) => e.preventDefault()}
          >
            entre em contato
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default Help;