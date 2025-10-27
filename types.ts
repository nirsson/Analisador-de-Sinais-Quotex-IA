
export interface Justification {
  summary: string;
  supportResistance: string;
  candlesticks: string;
  bollingerBands: string;
  oscillator: string;
  volume: string;
  multiTimeframeAnalysis: string;
}

export interface AnalysisResult {
  asset: string;
  candleTimeRemaining: string;
  signal: 'CALL' | 'PUT' | 'WAIT';
  confidence: 'High' | 'Medium' | 'Low';
  justification: Justification;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}