import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { fileIcons } from './icons';

async function countWords(file) {
    const extension = file.name.split('.').pop().toLowerCase();
    let text = '';

    if (extension === 'pdf') {
        const pdf = await file.arrayBuffer();
        const pdfDoc = await pdfjsLib.getDocument({ data: pdf }).promise;
        for (let i = 1; i <= pdfDoc.numPages; i++) {
            const page = await pdfDoc.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map(item => item.str).join(' ');
        }
    } else if (extension === 'docx') {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
    } else if (extension === 'xlsx') {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        workbook.SheetNames.forEach(name => {
            const sheet = workbook.Sheets[name];
            text += XLSX.utils.sheet_to_csv(sheet);
        });
    }else if (extension === 'pptx') {
        const arrayBuffer = await file.arrayBuffer();
        const zip = await JSZip.loadAsync(arrayBuffer);

        const slideTexts = [];
        const slideRegex = /^ppt\/slides\/slide\d+\.xml$/;

        for (const fileName of Object.keys(zip.files)) {
            if (slideRegex.test(fileName)) {
                const slideXml = await zip.files[fileName].async('string');
                const matches = [...slideXml.matchAll(/<a:t>(.*?)<\/a:t>/g)];
                matches.forEach(match => {
                    slideTexts.push(match[1]);
                });
            }
        }

        text = slideTexts.join(' ');
    } else if ([ 'js', 'jsx', 'ts', 'tsx',  
        'py', 'pyw', 'pyx',        
        'java', 'jsp',             
        'c', 'cpp', 'h', 'hpp',    
        'php',                     
        'rb',                      
        'go',                      
        'rs',                      
        'swift',                   
        'kt',                      
        'scala',                   
        'pl',                      
        'lua',                     
        'r',
        'txt',                       
        'dart',                    
        'sql',                     
        'html', 'htm',            
        'css'].includes(extension)) {
        const fileText = await file.text();
        text = fileText;
    } else {
        return 0;
    }

    return text.trim().split(/\s+/).length;
}

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
        'js', 'jsx', 'ts', 'tsx',  
        'py', 'pyw', 'pyx',        
        'java', 'jsp',             
        'c', 'cpp', 'h', 'hpp',    
        'php',                     
        'rb',                      
        'go',                      
        'rs',                      
        'swift',                   
        'kt',                      
        'scala',                   
        'pl',                      
        'lua',                     
        'r',                       
        'dart',                    
        'sql',                     
        'html', 'htm',            
        'css'                      
    ].includes(extension)) return fileIcons.code;
    
    return fileIcons.default;
};