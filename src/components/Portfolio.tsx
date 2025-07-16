import React from 'react';
import InteractiveCard from './InteractiveCard';
import Terminal from './Terminal';

const Portfolio: React.FC = () => {
  return (
    <div className="h-screen w-screen bg-black text-green-400 font-mono flex flex-col overflow-hidden">
      {/* Header always at top */}
      <div className="flex-none px-6 py-2 border-b border-green-700 flex flex-col justify-center text-left" style={{minHeight: '56px'}}>
        <h1 className="text-2xl font-bold text-green-400 leading-tight">Ankit Kumar</h1>
        <p className="text-gray-400 text-base">Full Stack Developer</p>
      </div>
      {/* Main Content: responsive layout */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        {/* Card section */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-transparent min-h-0 h-full relative py-6 md:py-0 mb-6 md:mb-0">
          <InteractiveCard />
          {/* Changed label to '[Interactive 3D Robo]' */}
          <div className="absolute left-4 bottom-4 md:left-6 md:bottom-6">
            <div className="text-green-400 text-xs border border-green-400 rounded px-2 py-1 inline-block">[Interactive 3D Robo]</div>
          </div>
        </div>
        {/* Terminal section */}
        <div className="w-full md:w-1/2 flex items-center justify-center min-h-0 h-full border-t-2 md:border-t-0 md:border-l-2 border-green-700 px-2 md:px-0 py-6 md:py-0 mt-12 md:mt-0">
          <div className="w-full max-w-full md:max-w-none h-72 md:h-full flex items-center justify-center">
            <Terminal />
          </div>
        </div>
      </div>
      {/* Footer always at bottom */}
      <div className="flex-none bg-black text-green-400 px-6 py-2 text-sm border-t border-green-700 text-center">
        <div className="flex justify-between">
          <span>ankit@portfolio:~$</span>
          <span>{new Date().toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;