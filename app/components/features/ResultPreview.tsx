import { useState } from 'react';
import { useImage } from '@/app/context/ImageContext';

const ResultPreview = () => {
  const { state } = useImage();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!state.processedImage) return;
    
    try {
      setIsDownloading(true);
      const response = await fetch(state.processedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `processed-image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!state.processedImage) return null;

  return (
    <div className="mt-6">
      <div className="relative aspect-square rounded-lg overflow-hidden border">
        <img
          src={state.processedImage}
          alt="处理结果"
          className="w-full h-full object-contain"
        />
      </div>
      <div className="mt-4 flex justify-center">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className={`
            px-6 py-2 rounded-lg bg-blue-500 text-white
            flex items-center gap-2 transition-all duration-200
            ${isDownloading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}
          `}
        >
          {isDownloading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          )}
          {isDownloading ? '下载中...' : '下载结果'}
        </button>
      </div>
    </div>
  );
};

export default ResultPreview; 