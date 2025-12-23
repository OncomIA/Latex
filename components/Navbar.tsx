
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-slate-500">Workspace / <span className="text-slate-900">Project Architect</span></span>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <i className="fas fa-bell"></i>
        </button>
        <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <i className="fas fa-gear"></i>
        </button>
        <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
        <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs font-semibold text-indigo-700">AI Engine Ready</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
