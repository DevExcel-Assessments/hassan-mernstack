import React from 'react';

const Loader = ({ 
  type = 'spinner', 
  size = 'md', 
  color = 'blue', 
  text = '', 
  fullScreen = false 
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'xs':
        return 'w-4 h-4';
      case 'sm':
        return 'w-6 h-6';
      case 'md':
        return 'w-8 h-8';
      case 'lg':
        return 'w-12 h-12';
      case 'xl':
        return 'w-16 h-16';
      default:
        return 'w-8 h-8';
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return 'text-blue-600';
      case 'green':
        return 'text-green-600';
      case 'red':
        return 'text-red-600';
      case 'yellow':
        return 'text-yellow-600';
      case 'purple':
        return 'text-purple-600';
      case 'gray':
        return 'text-gray-600';
      case 'white':
        return 'text-white';
      default:
        return 'text-blue-600';
    }
  };

  const Spinner = () => (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-current ${getSizeClasses()} ${getColorClasses()}`} />
  );

  const Dots = () => (
    <div className="flex space-x-1">
      <div className={`w-2 h-2 bg-current rounded-full animate-bounce ${getColorClasses()}`} style={{ animationDelay: '0ms' }} />
      <div className={`w-2 h-2 bg-current rounded-full animate-bounce ${getColorClasses()}`} style={{ animationDelay: '150ms' }} />
      <div className={`w-2 h-2 bg-current rounded-full animate-bounce ${getColorClasses()}`} style={{ animationDelay: '300ms' }} />
    </div>
  );

  const Pulse = () => (
    <div className={`animate-pulse rounded-full bg-current ${getSizeClasses()} ${getColorClasses()}`} />
  );

  const Ring = () => (
    <div className={`animate-spin rounded-full border-4 border-gray-200 border-t-current ${getSizeClasses()} ${getColorClasses()}`} />
  );

  const Bars = () => (
    <div className="flex space-x-1">
      <div className={`w-1 h-4 bg-current animate-pulse ${getColorClasses()}`} style={{ animationDelay: '0ms' }} />
      <div className={`w-1 h-4 bg-current animate-pulse ${getColorClasses()}`} style={{ animationDelay: '150ms' }} />
      <div className={`w-1 h-4 bg-current animate-pulse ${getColorClasses()}`} style={{ animationDelay: '300ms' }} />
    </div>
  );

  const getLoader = () => {
    switch (type) {
      case 'spinner':
        return <Spinner />;
      case 'dots':
        return <Dots />;
      case 'pulse':
        return <Pulse />;
      case 'ring':
        return <Ring />;
      case 'bars':
        return <Bars />;
      default:
        return <Spinner />;
    }
  };

  const content = (
    <div className="flex flex-col items-center justify-center space-y-3">
      {getLoader()}
      {text && (
        <p className={`text-sm font-medium ${getColorClasses()}`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader; 