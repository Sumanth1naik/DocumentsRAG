export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  sources?: Source[];
  isLoading?: boolean;
}

export interface Source {
  source: string;
  chunk_id?: number;
  page?: number;
}

export interface ChatRequest {
  session_id: string;
  question: string;
}

export interface ChatResponse {
  answer: string;
  sources: Source[];
}

export interface QueryRequest {
  question: string;
}

export interface QueryResponse {
  answer: string;
  sources: Source[];
}

export interface UploadResponse {
  message: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}
