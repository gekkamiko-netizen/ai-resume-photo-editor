
export interface ImageState {
  original: string | null;
  processed: string | null;
  loading: boolean;
  error: string | null;
}

export interface GeminiEditResponse {
  imageUrl: string | null;
  text?: string;
}

export type SuitColor = 'black' | 'navy' | 'gray';

export interface ProcessOptions {
  suitColor: SuitColor;
}
