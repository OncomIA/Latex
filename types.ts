
export enum ProjectType {
  BOOK = 'book',
  ARTICLE = 'article'
}

export enum AppLanguage {
  ES = 'es',
  EN = 'en'
}

export interface LatexFile {
  name: string;
  content: string;
  path: string;
}

export interface ProjectState {
  id: string;
  name: string;
  type: ProjectType;
  language: AppLanguage;
  files: LatexFile[];
  createdAt: number;
}

export interface FileData {
  name: string;
  type: string;
  base64: string;
  content?: string; // Extracted text if applicable
}
