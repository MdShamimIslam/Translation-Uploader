import React from 'react';
import { useDropzone } from 'react-dropzone';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function FileUploader({ setFiles, setTotalWords }) {
  
    const { getRootProps, getInputProps } = useDropzone({
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
            'application/javascript': ['.js'],
            'text/x-python': ['.py'],
            'text/x-java': ['.java'],
            'text/x-c': ['.c', '.cpp']
        }
    });

    return (
        <div style={{ border: "2px dashed #ccc", padding: "20px", marginBottom: "20px", textAlign: "center" }}>
            <div {...getRootProps()} style={{ cursor: 'pointer' }}>
                <input {...getInputProps()} />
                <p>Drag and drop some files here, or click to select files</p>
                <p style={{ fontSize: '12px', color: '#666' }}>
                    Supported files: PDF, DOCX, XLSX, PPTX, TXT, JS, PY, JAVA, C, CPP
                </p>
            </div>
        </div>
    );
}

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
    } else if (['txt', 'js', 'py', 'java', 'c', 'cpp'].includes(extension)) {
        const fileText = await file.text();
        text = fileText;
    } else {
        return 0;
    }

    return text.trim().split(/\s+/).length;
}


