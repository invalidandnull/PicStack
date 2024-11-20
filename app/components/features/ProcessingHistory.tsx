import { useImage } from '@/app/context/ImageContext';
import { ProcessingHistory as HistoryType } from '@/app/types';

const HistoryItem = ({ item }: { item: HistoryType }) => {
  const { uploadImage } = useImage();

  const handleReuse = () => {
    uploadImage(item.originalImage);
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="aspect-square relative rounded-lg overflow-hidden">
          <img 
            src={item.originalImage} 
            alt="Original" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="aspect-square relative rounded-lg overflow-hidden">
          <img 
            src={item.processedImage} 
            alt="Processed" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium">{item.style}</p>
          <p className="text-xs text-gray-500">
            {new Date(item.timestamp).toLocaleString()}
          </p>
        </div>
        <button
          onClick={handleReuse}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          重新使用
        </button>
      </div>
    </div>
  );
};

const ProcessingHistory = () => {
  const { state } = useImage();

  if (state.history.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-lg font-medium mb-4">处理历史</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {state.history.map((item) => (
          <HistoryItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default ProcessingHistory; 