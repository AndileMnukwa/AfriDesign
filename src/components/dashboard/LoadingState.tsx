interface LoadingStateProps {
  message: string;
}

const LoadingState = ({ message }: LoadingStateProps) => {
  return (
    <div className="text-center py-8">
      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
      <p className="text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingState;