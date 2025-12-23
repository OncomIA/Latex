
import React from 'react';
import { ProjectState } from '../types.ts';

interface SidebarProps {
  projects: ProjectState[];
  currentProjectId: string | null;
  onSelectProject: (id: string) => void;
  onNewProject: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ projects, currentProjectId, onSelectProject, onNewProject }) => {
  return (
    <aside className="w-72 bg-slate-900 text-white flex flex-col h-full border-r border-slate-800">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <i className="fas fa-file-code text-xl"></i>
          </div>
          <h1 className="text-xl font-bold tracking-tight">Overleaf Arch</h1>
        </div>
        
        <button 
          onClick={onNewProject}
          className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center justify-center gap-2 transition-all font-medium mb-6"
        >
          <i className="fas fa-plus"></i>
          New Project
        </button>

        <div className="space-y-1">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">Projects</h2>
          {projects.length === 0 ? (
            <p className="text-sm text-slate-500 px-2 italic">No projects yet</p>
          ) : (
            projects.map(project => (
              <button
                key={project.id}
                onClick={() => onSelectProject(project.id)}
                className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-3 transition-colors ${
                  currentProjectId === project.id ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <i className={`fas ${project.type === 'book' ? 'fa-book' : 'fa-file-lines'} opacity-75`}></i>
                <span className="truncate text-sm">{project.name}</span>
              </button>
            ))
          )}
        </div>
      </div>
      
      <div className="mt-auto p-6 border-t border-slate-800">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
            <i className="fas fa-user text-xs"></i>
          </div>
          <div className="text-xs">
            <p className="font-medium text-slate-200">Researcher User</p>
            <p className="opacity-75">Premium Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
