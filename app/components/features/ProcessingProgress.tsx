import { useImage } from '@/app/context/ImageContext';

const ProcessingProgress = () => {
  const { state } = useImage();

  if (state.status !== 'processing') return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <div className="flex flex-col items-center">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div 
              className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${state.progress}%` }}
            />
          </div>
          <p className="text-gray-700">处理进度: {state.progress}%</p>
          <p className="mt-2 text-sm text-gray-500">
            {state.selectedStyle === 'remove-bg' && '正在移除背景...'}
            {state.selectedStyle === 'enhance' && '正在增强图片...'}
            {state.selectedStyle === 'restore' && '正在修复照片...'}
            {/* 添加更多状态描述 */}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProcessingProgress; 