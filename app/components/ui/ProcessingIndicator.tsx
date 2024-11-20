import { useImage } from '@/app/context/ImageContext';

const ProcessingIndicator = () => {
  const { state } = useImage();

  if (state.status !== 'processing') return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
          <p className="mt-4 text-gray-700">正在处理图片...</p>
        </div>
      </div>
    </div>
  );
};

export default ProcessingIndicator; 