
import React from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-sky-100 z-50">
      <LoadingSpinner size="lg" message="Loading content..." />
    </div>
  );
};

export default LoadingScreen;
