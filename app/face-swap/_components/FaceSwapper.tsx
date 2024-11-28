'use client';

import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { decrementCredits } from '@/lib/supabase';
import { useSession } from 'next-auth/react';

interface ImageState {
  url: string;
  file: File;
}

export default function FaceSwapper() {
  const [sourceImage, setSourceImage] = useState<ImageState | null>(null);
  const [faceImage, setFaceImage] = useState<ImageState | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<'source' | 'face' | null>(null);
  const sourceInputRef = useRef<HTMLInputElement>(null);
  const faceInputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession()
  const user = session?.user

  const handleDragEnter = (type: 'source' | 'face') => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(type);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (type: 'source' | 'face') => async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(null);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      await handleFile(type, file);
    }
  };

  const handleFileSelect = (type: 'source' | 'face') => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFile(type, file);
    }
  };

  const handleFile = async (type: 'source' | 'face', file: File) => {
    try {
      const url = URL.createObjectURL(file);
      if (type === 'source') {
        setSourceImage({ url, file });
      } else {
        setFaceImage({ url, file });
      }
      setProcessedImage(null);
      setError(null);
    } catch (err) {
      console.error('File handling error:', err);
      setError('Failed to load image');
    }
  };

  const handleProcess = async () => {
    if (!sourceImage || !faceImage) {
      setError('Please upload both images');
      return;
    }
    if (!user) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Convert images to base64
      const [sourceBase64, faceBase64] = await Promise.all([
        readFileAsBase64(sourceImage.file),
        readFileAsBase64(faceImage.file)
      ]);

      const response = await fetch('/api/face-swap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source_image: sourceBase64,
          face_image: faceBase64
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Face swap failed');
      }

      setProcessedImage(data.output);
      decrementCredits(user.email)
    } catch (err) {
      console.error('Processing error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleDownload = async () => {
    if (!processedImage) return;

    try {
      const response = await fetch(processedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `face-swap-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to download image');
    }
  };

  const UploadArea = ({ type, inputRef, image, isDraggingThis }: {
    type: 'source' | 'face';
    inputRef: React.RefObject<HTMLInputElement>;
    image: ImageState | null;
    isDraggingThis: boolean;
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {type === 'source' ? 'Target Photo (to be swapped)' : 'Face Photo (face to use)'}
      </label>
      {!image ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDragEnter={handleDragEnter(type)}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop(type)}
          className={cn(
            "border-2 border-dashed rounded-xl p-8 transition-colors duration-200 cursor-pointer",
            "flex flex-col items-center justify-center text-center min-h-[200px]",
            isDraggingThis
              ? "border-violet-500 bg-violet-50"
              : "border-gray-300 hover:border-violet-500"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect(type)}
          />
          <div className="w-12 h-12 mb-4 rounded-full bg-violet-50 flex items-center justify-center">
            <svg className="w-6 h-6 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm text-gray-500">
            {isDraggingThis ? 'Drop image here' : 'Click or drag image here'}
          </p>
        </div>
      ) : (
        <div className="relative group">
          <div className="aspect-square relative border rounded-xl overflow-hidden">
            <img
              src={image.url}
              alt={type === 'source' ? 'Target' : 'Face'}
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={() => type === 'source' ? setSourceImage(null) : setFaceImage(null)}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Upload Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <UploadArea
          type="source"
          inputRef={sourceInputRef}
          image={sourceImage}
          isDraggingThis={isDragging === 'source'}
        />
        <UploadArea
          type="face"
          inputRef={faceInputRef}
          image={faceImage}
          isDraggingThis={isDragging === 'face'}
        />
      </div>

      {/* Process Button */}
      {sourceImage && faceImage && (
        <div className="flex justify-center">
          <button
            onClick={handleProcess}
            disabled={isProcessing}
            className={cn(
              "px-8 py-3 rounded-lg text-white transition-colors",
              isProcessing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-violet-600 hover:bg-violet-700"
            )}
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              'Swap Face'
            )}
          </button>
        </div>
      )}

      {/* Result */}
      {processedImage && (
        <div className="space-y-4">
          <div className="relative group">
            <div className="aspect-square relative border rounded-xl overflow-hidden">
              <img
                src={processedImage}
                alt="Result"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={handleDownload}
              className="absolute bottom-4 right-4 p-3 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 