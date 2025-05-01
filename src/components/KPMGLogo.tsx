
import React from 'react';

const KPMGLogo: React.FC = () => {
  return (
    <div className="w-full max-w-xs">
      <div className="flex justify-center">
        <div className="grid grid-cols-4 gap-1">
          <div className="w-12 h-12 border-2 border-white"></div>
          <div className="w-12 h-12 border-2 border-white"></div>
          <div className="w-12 h-12 border-2 border-white"></div>
          <div className="w-12 h-12 border-2 border-white"></div>
        </div>
      </div>
      <div className="text-white text-center text-5xl font-bold mt-2">KPMG</div>
    </div>
  );
};

export default KPMGLogo;
