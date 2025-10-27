
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { ChatMessage, AnalysisResult } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    asset: { type: Type.STRING, description: 'O par de ativos de negociação (ex: EUR/USD, BTC/USD OTC).' },
    candleTimeRemaining: { type: Type.STRING, description: 'O tempo restante na vela atual.' },
    signal: { type: Type.STRING, enum: ['CALL', 'PUT', 'WAIT'], description: 'O sinal de negociação final.' },
    confidence: { type: Type.STRING, enum: ['High', 'Medium', 'Low'], description: 'O nível de confiança do sinal.' },
    justification: {
      type: Type.OBJECT,
      properties: {
        summary: { type: Type.STRING, description: 'Um breve resumo da análise em português.' },
        supportResistance: { type: Type.STRING, description: 'Análise dos níveis de suporte e resistência em português.' },
        candlesticks: { type: Type.STRING, description: 'Análise dos padrões de candlestick em português.' },
        bollingerBands: { type: Type.STRING, description: 'Análise das Bandas de Bollinger em português.' },
        oscillator: { type: Type.STRING, description: 'Análise de osciladores como Stochastic ou RSI em português.' },
        volume: { type: Type.STRING, description: 'Análise do volume de negociação em português.' },
        multiTimeframeAnalysis: { type: Type.STRING, description: 'Análise consolidada considerando os timeframes M1, M5 e H1, com base no gráfico M5 fornecido e no contexto de mercado mais amplo, em português.' },
      },
       required: ["summary", "supportResistance", "candlesticks", "bollingerBands", "oscillator", "volume", "multiTimeframeAnalysis"]
    },
  },
  required: ["asset", "candleTimeRemaining", "signal", "confidence", "justification"]
};

const getBasePrompt = () => `
    Você é um trader profissional de classe mundial, especialista em análise técnica de gráficos de 5 minutos (M5) da plataforma Quotex. Seu objetivo é identificar sinais de negociação de alta probabilidade com base puramente na ação do preço (price action).
    Analise a captura de tela do gráfico de negociação da Quotex fornecida. Com base APENAS nas informações visuais da imagem, realize uma análise completa e profissional.
    
    Checklist da Análise:
    1.  Identifique o par de ativos.
    2.  Identifique o tempo restante na vela ativa atual.
    3.  Analise minuciosamente os níveis de Suporte e Resistência.
    4.  Identifique e interprete Padrões de Candlestick significativos (ex: Doji, Engolfo, Martelo, Estrela Cadente).
    5.  Analise a ação do preço em relação às Bandas de Bollinger (sobrecompra, sobrevenda, rompimentos, cruzamentos da banda do meio).
    6.  Analise o Stochastic Momentum Index ou qualquer outro oscilador visível (RSI, Estocástico) para condições de sobrecompra/sobrevenda e divergências.
    7.  Analise as barras de volume para confirmar a força da ação do preço.
    8.  **Crucialmente, realize uma análise de múltiplos timeframes (multi-timeframe analysis) inferindo ou considerando o comportamento típico do preço e a consistência da tendência nos timeframes M1, M5 (o gráfico fornecido) e H1. Consolide essas perspectivas para aumentar a precisão e robustez do seu sinal.**
    9.  Sintetize todos esses fatores para gerar um único e claro sinal de negociação para o timeframe M5.
    10. Forneça uma justificativa detalhada e profissional para o seu sinal, referenciando observações específicas da sua análise, incluindo sua perspectiva de múltiplos timeframes.
    
    O sinal final deve ser uma de três opções: 'CALL' (uma previsão de compra/alta), 'PUT' (uma previsão de venda/baixa), ou 'WAIT' (se não houver um sinal de alta confiança).
    Forneça a saída no formato JSON especificado. Todas as justificativas textuais devem estar em **português do Brasil**.
`;

export const analyzeImage = async (image: File, useProModel: boolean): Promise<AnalysisResult> => {
    const imagePart = await fileToGenerativePart(image);
    const model = useProModel ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
    // Max thinking budget for 2.5 Pro is 32768, for Flash is 24576.
    // Given the multi-timeframe analysis is a complex task, we provide a generous thinking budget.
    const config = useProModel 
      ? { thinkingConfig: { thinkingBudget: 32768 } } 
      : { thinkingConfig: { thinkingBudget: 12288 } };

    const response: GenerateContentResponse = await ai.models.generateContent({
        model,
        contents: {
            parts: [
                { text: getBasePrompt() },
                imagePart,
            ]
        },
        config: {
            ...config,
            responseMimeType: 'application/json',
            responseSchema: analysisSchema,
        },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
};

export const getMarketNews = async (asset: string) => {
    const model = 'gemini-2.5-flash';
    const prompt = `Quais são as últimas notícias, o sentimento do mercado e os principais níveis técnicos para o ativo ${asset}? Resuma os pontos-chave que podem afetar seu preço a curto prazo. Forneça links para suas fontes. Responda em português do Brasil.`;
    
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          tools: [{googleSearch: {}}],
        },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return {
        news: response.text,
        sources: groundingChunks,
    };
};

export const continueChat = async (history: ChatMessage[]) => {
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        history: history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.content }]
        })),
        config: {
            systemInstruction: 'Você é um assistente de negociação prestativo e amigável. Responda sempre em português do Brasil.'
        }
    });

    const lastMessage = history[history.length - 1];
    const result = await chat.sendMessage({ message: lastMessage.content });

    return result.text;
};
