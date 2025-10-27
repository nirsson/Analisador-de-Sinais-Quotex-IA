import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisResultDisplay } from './components/AnalysisResult';
import { MarketNews } from './components/MarketNews';
import { ChatBot } from './components/ChatBot';
import { LoadingSpinner, BrainCircuitIcon, SparklesIcon, AnalyzerIcon, ChatIcon } from './components/icons';
import { analyzeImage, getMarketNews } from './services/geminiService';
import type { AnalysisResult, GroundingChunk } from './types';

type ActiveTab = 'analyzer' | 'chat';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [marketNews, setMarketNews] = useState<string | null>(null);
  const [groundingSources, setGroundingSources] = useState<GroundingChunk[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isNewsLoading, setIsNewsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('analyzer');

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    setAnalysisResult(null);
    setMarketNews(null);
    setGroundingSources([]);
    setError(null);
  };

  const handleAnalysis = useCallback(async (useProModel: boolean) => {
    if (!imageFile) {
      setError("Por favor, carregue uma imagem primeiro.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setMarketNews(null);
    setGroundingSources([]);

    try {
      const result = await analyzeImage(imageFile, useProModel);
      setAnalysisResult(result);

      if (result.asset) {
        setIsNewsLoading(true);
        const newsData = await getMarketNews(result.asset);
        setMarketNews(newsData.news);
        setGroundingSources(newsData.sources);
        setIsNewsLoading(false);
      }

    } catch (e: any) {
      console.error(e);
      let errorMessage = "Falha ao analisar a imagem. O modelo pode não ter conseguido processá-la. Por favor, tente outra imagem ou verifique o console para mais detalhes.";

      if (e instanceof Error) {
        const msg = e.message.toLowerCase();
        if (msg.includes("api key") || msg.includes("authentication")) {
          errorMessage = "Erro de autenticação: Certifique-se de que sua chave de API é válida e está configurada corretamente.";
        } else if (msg.includes("safety") || msg.includes("content policy")) {
          errorMessage = "O modelo de IA não conseguiu gerar uma resposta, possivelmente devido a configurações de segurança ou política de conteúdo. Por favor, tente uma imagem ou prompt diferente.";
        } else if (msg.includes("quota") || msg.includes("rate limit")) {
          errorMessage = "Limite da API atingido ou cota excedida. Por favor, tente novamente após algum tempo.";
        } else if (msg.includes("json") && msg.includes("unexpected")) {
          errorMessage = "O modelo de IA retornou um formato de resposta inesperado. A análise falhou ao analisar a saída. Por favor, tente novamente.";
        } else if (msg.includes("network") || msg.includes("failed to fetch")) {
          errorMessage = "Ocorreu um erro de rede. Verifique sua conexão com a internet e tente novamente.";
        } else if (msg.includes("invalid argument") || msg.includes("bad request")) {
            errorMessage = "Entrada de imagem inválida. Certifique-se de que a imagem é clara, relevante e está em um formato suportado (PNG, JPG, WEBP).";
        } else if (msg.includes("timeout")) {
            errorMessage = "A análise expirou. Isso pode acontecer com imagens complexas ou problemas de rede. Por favor, tente novamente.";
        }
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);

  const TabButton: React.FC<{tabName: ActiveTab, icon: React.ReactNode, label: string}> = ({tabName, icon, label}) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${activeTab === tabName ? 'bg-cyan-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <header className="bg-gray-800/50 backdrop-blur-sm p-4 text-center shadow-lg sticky top-0 z-10">
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          Quotex Signal Analyzer AI
        </h1>
        <p className="text-gray-400 mt-1">Carregue um gráfico. Obtenha sinais com tecnologia de IA.</p>
      </header>
      
      <main className="p-4 md:p-8">
        <div className="flex justify-center mb-6">
          <div className="flex space-x-2 p-1 bg-gray-800 rounded-lg">
              <TabButton tabName="analyzer" icon={<AnalyzerIcon className="w-5 h-5"/>} label="Analisador"/>
              <TabButton tabName="chat" icon={<ChatIcon className="w-5 h-5"/>} label="Assistente de Chat"/>
          </div>
        </div>
        
        {activeTab === 'analyzer' && (
          <div className="max-w-5xl mx-auto">
            <div className="bg-gray-800 p-6 rounded-xl shadow-2xl">
              <ImageUploader onImageUpload={handleImageUpload} imageUrl={imageUrl} isLoading={isLoading}/>
              {imageFile && (
                <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                  <button onClick={() => handleAnalysis(false)} disabled={isLoading} className="flex items-center justify-center gap-2 w-full sm:w-auto text-white font-bold py-3 px-6 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg">
                    {isLoading ? <LoadingSpinner/> : <SparklesIcon className="w-5 h-5"/>}
                    Análise Rápida
                  </button>
                  <button onClick={() => handleAnalysis(true)} disabled={isLoading} className="flex items-center justify-center gap-2 w-full sm:w-auto text-white font-bold py-3 px-6 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg">
                    {isLoading ? <LoadingSpinner/> : <BrainCircuitIcon className="w-5 h-5"/>}
                    Análise Aprofundada (Pro)
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-8 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
                <p>{error}</p>
              </div>
            )}
            
            <div className="mt-8">
              {isLoading && (
                <div className="flex flex-col items-center justify-center text-center p-8 bg-gray-800 rounded-xl">
                  <LoadingSpinner />
                  <p className="mt-4 text-lg font-semibold text-gray-300">Analisando gráfico com Gemini...</p>
                  <p className="text-gray-400">Isso pode levar um momento.</p>
                </div>
              )}
              {analysisResult && <AnalysisResultDisplay result={analysisResult} />}
              <MarketNews news={marketNews} sources={groundingSources} isLoading={isNewsLoading} />
            </div>
          </div>
        )}
        
        {activeTab === 'chat' && (
           <ChatBot/>
        )}
      </main>
       <footer className="text-center p-4 text-gray-500 text-sm">
        <p>Aviso Legal: Esta ferramenta destina-se apenas para fins educacionais e não constitui aconselhamento financeiro. Negociar envolve riscos.</p>
      </footer>
    </div>
  );
};

export default App;