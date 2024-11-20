import { useState } from 'react';
import { useImage } from '@/app/context/ImageContext';
import { ImageStyle } from '@/app/types';
import ImageUploader from './ImageUploader';
import ProcessingOptions from './ProcessingOptions';
import ProcessingProgress from './ProcessingProgress';
import ProcessingHistory from './ProcessingHistory';
import ResultPreview from './ResultPreview';
import ErrorMessage from '../ui/ErrorMessage';

const ImageProcessor = () => {
  const { state, processImage, reset } = useImage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcessing = async (style: ImageStyle) => {
    if (!state.originalImage || isProcessing) return;
    
    setIsProcessing(true);
    setError(null);
    try {
      await processImage(style);
    } catch (error) {
      setError(error instanceof Error ? error.message : '处理失败');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="space-y-8">
        {!state.originalImage && <ImageUploader />}

        {state.originalImage && (
          <>
            <div className="relative aspect-square border rounded-lg overflow-hidden">
              <img 
                src={state.originalImage}
                alt="Original"
                className="w-full h-full object-contain"
              />
              <button
                onClick={reset}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <ProcessingOptions
              onSelect={handleProcessing}
              disabled={isProcessing}
            />
          </>
        )}

        <ResultPreview />
        <ProcessingHistory />
        <ProcessingProgress />

        {error && (
          <ErrorMessage
            message={error}
            onRetry={() => state.selectedStyle && handleProcessing(state.selectedStyle)}
            onDismiss={() => setError(null)}
          />
        )}
      </div>
    </div>
  );
};

export default ImageProcessor; 