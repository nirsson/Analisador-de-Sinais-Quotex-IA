import React from 'react';
import { AnalysisResult, Justification } from '../types';

const SignalPill: React.FC<{ signal: 'CALL' | 'PUT' | 'WAIT' }> = ({ signal }) => {
  const baseClasses = 'px-6 py-2 text-2xl font-bold rounded-full shadow-lg';
  const styles = {
    CALL: 'bg-green-500 text-white',
    PUT: 'bg-red-500 text-white',
    WAIT: 'bg-gray-500 text-white',
  };
  return <div className={`${baseClasses} ${styles[signal]}`}>{signal}</div>;
};

const JustificationCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-gray-800 p-4 rounded-lg shadow-md">
    <h4 className="text-md font-semibold text-cyan-400 mb-2">{title}</h4>
    <p className="text-gray-300 text-sm">{children}</p>
  </div>
);

export const AnalysisResultDisplay: React.FC<{ result: AnalysisResult }> = ({ result }) => {
  const { asset, candleTimeRemaining, signal, confidence, justification } = result;

  const justificationItems = [
    { title: 'Resumo', content: justification.summary },
    { title: 'Suporte e Resistência', content: justification.supportResistance },
    { title: 'Padrões de Candlestick', content: justification.candlesticks },
    { title: 'Bandas de Bollinger', content: justification.bollingerBands },
    { title: 'Oscilador (Estocástico/RSI)', content: justification.oscillator },
    { title: 'Volume', content: justification.volume },
    { title: 'Análise de Múltiplos Prazos', content: justification.multiTimeframeAnalysis },
  ].filter(item => item.content && item.content.trim() !== '');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gray-800 p-6 rounded-xl shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold text-white">{asset}</h2>
          <p className="text-gray-400">Confiança: <span className="font-semibold text-white">{confidence}</span></p>
          <p className="text-gray-400">Tempo restante da vela: <span className="font-semibold text-white">{candleTimeRemaining}</span></p>
        </div>
        <div className="flex-shrink-0">
          <SignalPill signal={signal} />
        </div>
      </div>
      
      <div>
        <h3 className="text-2xl font-bold mb-4 text-white">Análise Profissional</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {justificationItems.map(item => (
            <JustificationCard key={item.title} title={item.title}>
              {item.content}
            </JustificationCard>
          ))}
        </div>
      </div>
    </div>
  );
};