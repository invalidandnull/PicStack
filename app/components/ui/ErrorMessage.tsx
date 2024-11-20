interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

const ErrorMessage = ({ message, onRetry, onDismiss }: ErrorMessageProps) => {
  return (
    <div className="fixed bottom-4 right-4 max-w-sm bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-lg">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">{message}</p>
          <div className="mt-2 flex space-x-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="text-sm text-red-700 hover:text-red-600 font-medium"
              >
                重试
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-sm text-gray-600 hover:text-gray-500"
              >
                关闭
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage; 