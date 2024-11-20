import { ImageStyle } from '@/app/types';

interface ProcessingOption {
  id: ImageStyle;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const processingOptions: ProcessingOption[] = [
  {
    id: 'remove-bg',
    label: '去除背景',
    description: '自动移除图片背景',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'enhance',
    label: '图片增强',
    description: '提升图片清晰度和质量',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
  {
    id: 'blur-bg',
    label: '虚化背景',
    description: '模糊化图片背景',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      </svg>
    )
  },
  {
    id: 'restore',
    label: '老照片修复',
    description: '修复和增强旧照片',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  // 添加更多选项...
];

interface ProcessingOptionsProps {
  onSelect: (style: ImageStyle) => void;
  disabled: boolean;
}

const ProcessingOptions = ({ onSelect, disabled }: ProcessingOptionsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
      {processingOptions.map((option) => (
        <button
          key={option.id}
          onClick={() => onSelect(option.id)}
          disabled={disabled}
          className={`
            p-4 rounded-lg border transition-all duration-200
            flex flex-col items-center text-center gap-2
            ${disabled 
              ? 'bg-gray-100 cursor-not-allowed opacity-50' 
              : 'hover:border-blue-500 hover:shadow-md'
            }
          `}
        >
          <div className="text-blue-500">{option.icon}</div>
          <h3 className="font-medium">{option.label}</h3>
          <p className="text-sm text-gray-500">{option.description}</p>
        </button>
      ))}
    </div>
  );
};

export default ProcessingOptions; 