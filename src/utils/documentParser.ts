
import { Question } from '../types/test';

export const parseDocFile = async (file: File): Promise<Question[]> => {
  try {
    const text = await file.text();
    
    const questions: Question[] = [];
    let currentCategory: 'coding' | 'math' | 'aptitude' | 'communication' | null = null;
    const lines = text.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (!line) continue;
      
      if (line.startsWith('Category:')) {
        const category = line.substring('Category:'.length).trim().toLowerCase();
        if (['coding', 'math', 'aptitude', 'communication'].includes(category)) {
          currentCategory = category as 'coding' | 'math' | 'aptitude' | 'communication';
        }
        continue;
      }
      
      if (line.startsWith('Question:')) {
        const questionText = line.substring('Question:'.length).trim();
        
        if (i + 1 < lines.length) {
          const optionsLine = lines[i + 1].trim();
          
          let options: string[] = [];
          if (optionsLine.includes(')')) {
            options = optionsLine.split(/[A-D]\)/).map(opt => opt.trim()).filter(Boolean);
          }
          
          if (i + 2 < lines.length && lines[i + 2].trim().startsWith('Answer:')) {
            const answer = lines[i + 2].substring('Answer:'.length).trim();
            
            questions.push({
              id: `q-${questions.length + 1}`,
              text: questionText,
              options,
              answer,
              category: currentCategory || 'aptitude',
            });
            
            i += 2;
          }
        }
      }
    }
    
    if (questions.length === 0) {
      throw new Error('No valid questions found in the file. Please check the format.');
    }
    
    return questions;
  } catch (error) {
    console.error('Error parsing file:', error);
    throw new Error('Failed to parse the document. Please check the format and try again.');
  }
};
