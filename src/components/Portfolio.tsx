import React from 'react';
import InteractiveCard from './InteractiveCard';
import Terminal from './Terminal';

const Portfolio: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-green-400 font-mono flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-3xl font-bold text-green-400">Ankit Kumar</h1>
        <p className="text-gray-400 text-lg">Full Stack Developer</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left side - Interactive ID Card */}
        <div className="w-1/2 flex flex-col items-center justify-center p-8 border-r border-gray-800 bg-gradient-to-br from-gray-900 to-black">
          <InteractiveCard />
        </div>

        {/* Right side - Terminal */}
        <div className="w-1/2 flex flex-col p-8">
          <Terminal />
        </div>
      </div>

      {/* Bottom status bar */}
      <div className="bg-gray-900 text-green-400 px-6 py-2 text-sm border-t border-gray-800">
        <div className="flex justify-between">
          <span>ankit@portfolio:~$</span>
          <span>{new Date().toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;