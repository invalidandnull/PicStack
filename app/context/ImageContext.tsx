import { createContext, useContext, useReducer, ReactNode } from 'react';
import { ImageState, ImageStyle, ProcessingStatus } from '@/app/types';
import { fluxService } from '@/app/services/fluxService';

interface ImageContextType {
  state: ImageState;
  uploadImage: (file: File) => Promise<void>;
  processImage: (style: ImageStyle) => Promise<void>;
  reset: () => void;
}

const initialState: ImageState = {
  originalImage: null,
  processedImage: null,
  status: 'idle',
  selectedStyle: null,
  history: [],
  progress: 0,
};

const ImageContext = createContext<ImageContextType | undefined>(undefined);

type ImageAction =
  | { type: 'SET_ORIGINAL_IMAGE'; payload: string }
  | { type: 'SET_PROCESSED_IMAGE'; payload: string }
  | { type: 'SET_STATUS'; payload: ProcessingStatus }
  | { type: 'SET_STYLE'; payload: ImageStyle }
  | { type: 'RESET' };

const imageReducer = (state: ImageState, action: ImageAction): ImageState => {
  switch (action.type) {
    case 'SET_ORIGINAL_IMAGE':
      return { ...state, originalImage: action.payload };
    case 'SET_PROCESSED_IMAGE':
      return { ...state, processedImage: action.payload };
    case 'SET_STATUS':
      return { ...state, status: action.payload };
    case 'SET_STYLE':
      return { ...state, selectedStyle: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

export const ImageProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(imageReducer, initialState);

  const uploadImage = async (file: File) => {
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch({ type: 'SET_ORIGINAL_IMAGE', payload: reader.result as string });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const processImage = async (style: ImageStyle) => {
    if (!state.originalImage) return;

    dispatch({ type: 'SET_STATUS', payload: 'processing' });
    dispatch({ type: 'SET_STYLE', payload: style });

    try {
      let result;
      switch (style) {
        case 'remove-bg':
          result = await fluxService.removeBackground(state.originalImage);
          break;
        case 'enhance':
          result = await fluxService.enhanceImage(state.originalImage);
          break;
        default:
          throw new Error('Unsupported style');
      }

      if (!result) {
        throw new Error('Processing failed - no result received');
      }

      console.log('Processing completed:', result);
      
      dispatch({ type: 'SET_PROCESSED_IMAGE', payload: result });
      dispatch({ type: 'SET_STATUS', payload: 'completed' });
      
      const historyItem = {
        id: Date.now().toString(),
        originalImage: state.originalImage,
        processedImage: result,
        style,
        timestamp: Date.now(),
      };
      // 添加到历史记录
      //dispatch({ type: 'SET_HISTORY', payload: [...state.history, historyItem] });
    } catch (error) {
      console.error('Processing failed:', error);
      dispatch({ type: 'SET_STATUS', payload: 'error' });
      throw error;
    }
  };

  const reset = () => {
    dispatch({ type: 'RESET' });
  };

  return (
    <ImageContext.Provider value={{ state, uploadImage, processImage, reset }}>
      {children}
    </ImageContext.Provider>
  );
};

export const useImage = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useImage must be used within an ImageProvider');
  }
  return context;
}; 