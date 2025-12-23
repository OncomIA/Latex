
import React, { useState } from 'react';
import { ProjectType, AppLanguage, ProjectState, FileData } from './types.ts';
import { generateLatexProject } from './services/geminiService.ts';
import Sidebar from './components/Sidebar.tsx';
import ProjectConfig from './components/ProjectConfig.tsx';
import EditorView from './components/EditorView.tsx';
import Navbar from './components/Navbar.tsx';

const App: React.FC = () => {
  const [projects, setProjects] = useState<ProjectState[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateProject = async (
    name: string,
    refFile: FileData,
    srcFiles: FileData[],
    type: ProjectType,
    lang: AppLanguage,
    instructions: string
  ) => {
    setIsGenerating(true);
    setError(null);
    try {
      const generatedFiles = await generateLatexProject(refFile, srcFiles, type, lang, instructions);
      
      const newProject: ProjectState = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        type,
        language: lang,
        files: generatedFiles,
        createdAt: Date.now(),
      };

      setProjects(prev => [newProject, ...prev]);
      setCurrentProjectId(newProject.id);
    } catch (err: any) {
      console.error(err);
      setError("Error generating LaTeX project. Please verify your files and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const currentProject = projects.find(p => p.id === currentProjectId);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar 
        projects={projects} 
        currentProjectId={currentProjectId} 
        onSelectProject={setCurrentProjectId} 
        onNewProject={() => setCurrentProjectId(null)}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        
        <main className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-3">
              <i className="fas fa-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          )}

          {isGenerating ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
              <h2 className="text-xl font-semibold text-slate-700">Gemini is Architecting your LaTeX Project...</h2>
              <p className="text-slate-500 text-center max-w-md">
                Analyzing documents, splitting chapters, and applying your reference style. This might take a minute.
              </p>
            </div>
          ) : currentProject ? (
            <EditorView project={currentProject} />
          ) : (
            <ProjectConfig onSubmit={handleCreateProject} />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
