export type ImageStyle = 
  | 'remove-bg'
  | 'change-bg'
  | 'add-text'
  | 'blur-bg'
  | 'generate'
  | 'sketch-to-image'
  | 'face-swap'
  | 'enhance'
  | 'blend-bg'
  | 'remove-text'
  | 'restore'
  | 'brighten'
  | 'id-photo'
  | 'change-style';

export type ProcessingStatus = 'idle' | 'processing' | 'completed' | 'error';

export interface ProcessingHistory {
  id: string;
  originalImage: string;
  processedImage: string;
  style: ImageStyle;
  timestamp: number;
}

export interface ImageState {
  originalImage: string | null;
  processedImage: string | null;
  status: ProcessingStatus;
  selectedStyle: ImageStyle | null;
  history: ProcessingHistory[];
  progress: number;
} 