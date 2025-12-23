
import React, { useState } from 'react';
import { ProjectState, LatexFile } from '../types.ts';

interface EditorViewProps {
  project: ProjectState;
}

const EditorView: React.FC<EditorViewProps> = ({ project }) => {
  const [selectedFile, setSelectedFile] = useState<LatexFile>(project.files[0]);

  const handleOpenInOverleaf = () => {
    // Overleaf "Open in Overleaf" API uses a form submission
    // We create a temporary form to POST the content as a ZIP or multi-file payload
    const blob = new Blob([JSON.stringify(project.files, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.replace(/\s+/g, '_')}_latex_project.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    alert("Project structure exported! You can now upload these files to Overleaf. In a real-world production app, this would use Overleaf's git integration.");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Code copied to clipboard!");
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{project.name}</h2>
          <p className="text-xs text-slate-500 uppercase font-medium tracking-wider">
            {project.type} • {project.language === 'es' ? 'Spanish' : 'English'}
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleOpenInOverleaf}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-2 font-medium"
          >
            <i className="fas fa-cloud-arrow-up"></i>
            Export for Overleaf
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        <div className="w-64 bg-white rounded-xl shadow-sm border border-slate-200 overflow-y-auto p-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase mb-4">Project Files</h3>
          <div className="space-y-1">
            {project.files.map((file, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 text-sm transition-all ${
                  selectedFile.path === file.path ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <i className={`fas ${file.name.endsWith('.tex') ? 'fa-file-code' : 'fa-folder'}`}></i>
                <span className="truncate">{file.path}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 bg-slate-900 rounded-xl shadow-xl border border-slate-800 flex flex-col min-h-0">
          <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800">
            <span className="text-slate-400 text-sm font-mono">{selectedFile.path}</span>
            <button 
              onClick={() => copyToClipboard(selectedFile.content)}
              className="text-slate-400 hover:text-white transition-colors text-xs flex items-center gap-2"
            >
              <i className="fas fa-copy"></i>
              Copy
            </button>
          </div>
          <div className="flex-1 overflow-auto p-6 font-mono text-sm leading-relaxed text-slate-300">
            <pre className="whitespace-pre-wrap">{selectedFile.content}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorView;
