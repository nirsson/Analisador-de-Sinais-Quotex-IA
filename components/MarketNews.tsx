import React from 'react';
import { GroundingChunk } from '../types';
import { LoadingSpinner } from './icons';

interface MarketNewsProps {
  news: string | null;
  sources: GroundingChunk[];
  isLoading: boolean;
}

export const MarketNews: React.FC<MarketNewsProps> = ({ news, sources, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-gray-800 p-6 rounded-xl shadow-2xl mt-8 flex items-center justify-center h-48">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-2 text-gray-400">Buscando as últimas notícias do mercado...</p>
        </div>
      </div>
    );
  }
  
  if (!news) return null;

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl mt-8 animate-fade-in">
      <h3 className="text-2xl font-bold mb-4 text-white">Contexto e Notícias do Mercado</h3>
      <div className="prose prose-invert max-w-none text-gray-300">
        {news.split('\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      </div>
      {sources && sources.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-cyan-400 mb-2">Fontes</h4>
          <ul className="list-disc list-inside space-y-1">
            {sources.map((source, index) => source.web && (
              <li key={index}>
                <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline">
                  {source.web.title || source.web.uri}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};