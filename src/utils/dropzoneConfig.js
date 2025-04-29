import { countWords } from '../components/FileUploader';
import { fileIcons } from './icons';

export const useFileUpload = (setFiles, setTotalWords) => ({
    onDrop: async (acceptedFiles) => {
        for (let file of acceptedFiles) {
            const wordCount = await countWords(file);
            const newFile = {
                id: Date.now() + Math.random(),
                file,
                wordCount,
            };
            setFiles(prev => [...prev, newFile]);
            setTotalWords(prev => prev + wordCount);
        }
    },
    accept: {
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
        'application/pdf': ['.pdf'],
        'text/plain': ['.txt'],
        'text/html': ['.html', '.htm'],
        'text/css': ['.css'],
        'application/javascript': ['.js', '.jsx', '.ts', '.tsx'],
        'text/x-python': ['.py', '.pyw', '.pyx'],
        'text/x-java': ['.java', '.jsp'],
        'text/x-c': ['.c', '.cpp', '.h', '.hpp'],
        'text/x-php': ['.php'],
        'text/x-ruby': ['.rb'],
        'text/x-go': ['.go'],
        'text/x-rust': ['.rs'],
        'text/x-swift': ['.swift'],
        'text/x-kotlin': ['.kt'],
        'text/x-scala': ['.scala'],
        'text/x-perl': ['.pl'],
        'text/x-lua': ['.lua'],
        'text/x-r': ['.r'],
        'text/x-dart': ['.dart'],
        'text/x-sql': ['.sql']
    }
});

export const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    
    if (extension === 'pdf') return fileIcons.pdf;
    if (extension === 'docx') return fileIcons.docx;
    if (extension === 'xlsx') return fileIcons.xlsx;
    if (extension === 'txt') return fileIcons.txt;
    if (extension === 'pptx') return fileIcons.pptx;
    if ([
        'js', 'jsx', 'ts', 'tsx',  // JavaScript/TypeScript
        'py', 'pyw', 'pyx',        // Python
        'java', 'jsp',             // Java
        'c', 'cpp', 'h', 'hpp',    // C/C++
        'php',                     // PHP
        'rb',                      // Ruby
        'go',                      // Go
        'rs',                      // Rust
        'swift',                   // Swift
        'kt',                      // Kotlin
        'scala',                   // Scala
        'pl',                      // Perl
        'lua',                     // Lua
        'r',                       // R
        'dart',                    // Dart
        'sql',                     // SQL
        'html', 'htm',            // HTML
        'css'                      // CSS
    ].includes(extension)) return fileIcons.code;
    
    return fileIcons.default;
};