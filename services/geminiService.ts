
import { GoogleGenAI, Type } from "@google/genai";
import { ProjectType, AppLanguage, LatexFile, FileData } from "../types.ts";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const LATEX_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    files: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Filename e.g. main.tex, chapters/introduction.tex" },
          content: { type: Type.STRING, description: "Full LaTeX code for this file" },
          path: { type: Type.STRING, description: "Path e.g. 'main.tex' or 'chapters/intro.tex'" }
        },
        required: ["name", "content", "path"]
      }
    }
  },
  required: ["files"]
};

export async function generateLatexProject(
  referenceFile: FileData,
  sourceFiles: FileData[],
  projectType: ProjectType,
  language: AppLanguage,
  instructions: string
): Promise<LatexFile[]> {
  
  const parts: any[] = [
    { text: `You are a world-class LaTeX architect. 
    Task: Convert the following source documents into a professional LaTeX project.
    Output Format: A JSON object containing multiple files.
    Requirements:
    1. Use the style and structure implied by the 'Reference Document' provided.
    2. Structure as a ${projectType}. 
    3. If it's a book, create a main.tex file and separate chapter files in a 'chapters/' folder.
    4. If it's an article, use a structured sections approach.
    5. Output language: ${language === 'es' ? 'Spanish' : 'English'}.
    6. Additional Instructions: ${instructions}
    
    Sources to process:
    - Reference Document (Template): ${referenceFile.name}
    - Content Documents: ${sourceFiles.map(f => f.name).join(', ')}
    ` }
  ];

  if (referenceFile.name.toLowerCase().endsWith('.pdf')) {
    parts.push({
      inlineData: {
        data: referenceFile.base64,
        mimeType: 'application/pdf'
      }
    });
  } else if (referenceFile.content) {
    parts.push({ text: `--- REFERENCE DOCUMENT CONTENT (${referenceFile.name}) ---\n${referenceFile.content}` });
  }

  sourceFiles.forEach(file => {
    if (file.name.toLowerCase().endsWith('.pdf')) {
      parts.push({
        inlineData: {
          data: file.base64,
          mimeType: 'application/pdf'
        }
      });
    } else if (file.content) {
      parts.push({ text: `--- SOURCE DOCUMENT CONTENT (${file.name}) ---\n${file.content}` });
    }
  });

  const model = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    config: {
      responseMimeType: "application/json",
      responseSchema: LATEX_SCHEMA,
    },
    contents: [{ role: "user", parts }]
  });

  const result = JSON.parse(model.text || '{"files": []}');
  return result.files;
}
