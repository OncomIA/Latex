
import React, { useState } from 'react';
import { ProjectType, AppLanguage, FileData } from '../types.ts';
import * as mammoth from 'mammoth';

interface ProjectConfigProps {
  onSubmit: (name: string, ref: FileData, srcs: FileData[], type: ProjectType, lang: AppLanguage, instructions: string) => void;
}

const ProjectConfig: React.FC<ProjectConfigProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<ProjectType>(ProjectType.BOOK);
  const [lang, setLang] = useState<AppLanguage>(AppLanguage.ES);
  const [instructions, setInstructions] = useState('');
  const [refFile, setRefFile] = useState<FileData | null>(null);
  const [sourceFiles, setSourceFiles] = useState<FileData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isRef: boolean) => {
    const files = e.target.files;
    if (!files) return;

    setIsProcessing(true);
    const fileList: FileData[] = [];
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
          reader.readAsDataURL(file);
        });

        let extractedContent = '';
        if (file.name.toLowerCase().endsWith('.docx')) {
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          extractedContent = result.value;
        }

        fileList.push({ 
          name: file.name, 
          type: file.type || 'application/octet-stream', 
          base64,
          content: extractedContent 
        });
      }

      if (isRef) {
        setRefFile(fileList[0]);
      } else {
        setSourceFiles(prev => [...prev, ...fileList]);
      }
    } catch (err) {
      console.error("Error processing files:", err);
      alert("Error processing some files. Please ensure they are valid PDF or DOCX documents.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !refFile || sourceFiles.length === 0) {
      alert("Please fill in all required fields and upload files.");
      return;
    }
    onSubmit(name, refFile, sourceFiles, type, lang, instructions);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Create New LaTeX Project</h2>
          <p className="text-slate-500">Define your project parameters and upload your source materials.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Project Name</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Master's Thesis 2024"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Document Type</label>
              <select 
                value={type}
                onChange={e => setType(e.target.value as ProjectType)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              >
                <option value={ProjectType.BOOK}>Book / Report (Multi-file)</option>
                <option value={ProjectType.ARTICLE}>Scientific Article (Single-file)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Language</label>
              <select 
                value={lang}
                onChange={e => setLang(e.target.value as AppLanguage)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              >
                <option value={AppLanguage.ES}>Spanish</option>
                <option value={AppLanguage.EN}>English</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className={`p-4 bg-slate-50 rounded-xl border-2 border-dashed transition-all ${isProcessing ? 'opacity-50 pointer-events-none' : 'border-slate-200'}`}>
              <label className="block text-sm font-bold text-slate-700 mb-3">
                <i className="fas fa-star text-amber-500 mr-2"></i>
                Base Style (Reference Word Document)
              </label>
              <input 
                type="file" 
                accept=".docx"
                onChange={e => handleFileUpload(e, true)}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              {refFile && <p className="mt-2 text-xs text-green-600 font-medium"><i className="fas fa-check"></i> {refFile.name} loaded</p>}
            </div>

            <div className={`p-4 bg-slate-50 rounded-xl border-2 border-dashed transition-all ${isProcessing ? 'opacity-50 pointer-events-none' : 'border-slate-200'}`}>
              <label className="block text-sm font-bold text-slate-700 mb-3">
                <i className="fas fa-files text-indigo-500 mr-2"></i>
                Source Documents (Word / PDF)
              </label>
              <input 
                type="file" 
                multiple
                accept=".docx,.pdf"
                onChange={e => handleFileUpload(e, false)}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {sourceFiles.map((f, i) => (
                  <span key={i} className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-600 shadow-sm">
                    {f.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Special Instructions for Gemini</label>
            <textarea 
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              placeholder="e.g. Ensure equations are numbered by section, use IEEE format for citations, split each major heading into a separate chapter file..."
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          <button 
            type="submit"
            disabled={isProcessing}
            className={`w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-[0.99] flex items-center justify-center gap-3 ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isProcessing && <i className="fas fa-circle-notch animate-spin"></i>}
            {isProcessing ? 'Processing Files...' : 'Architect LaTeX Project'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProjectConfig;
