import React from 'react';
import { useDropzone } from 'react-dropzone';
import { useFileUpload } from '../utils/dropzoneConfig';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import { uploadIcon } from '../utils/icons';
import supportIcons from '../assets/icons.png';
import { getFileIcon } from '../utils/dropzoneConfig';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function FileUploader({ files, setFiles, setTotalWords, sourceLanguage }) {
    const { getRootProps, getInputProps } = useDropzone({
        ...useFileUpload(setFiles, setTotalWords),
        disabled: !sourceLanguage
    });


    const removeFile = (id, wordCount) => {
        setFiles(prev => prev.filter(file => file.id !== id));
        setTotalWords(prev => prev - wordCount);
    };

    const uploadedDoc =  <>
                        <div style={{marginTop:'20px'}} className='sourceLang'>
                                <p>2</p>
                                <span>Upload Document file(s)</span>
                        </div>
                        <p className='originalLang'>
                        It is extremely important to us that your files are secure with us.Your files are exclusively stored on servers in Hong Kong.All of our "In-house" translators sign NDA's(Non-disclosure argument)and we train them to follow secure working practices.
                        </p>
                    </>

    const showAllFiles = <div className='showAllLoadedFiles'>
                            {files?.map((file) => (
                                <div key={file.id} className='file-card'>
                                    <div className='file-icon'>{getFileIcon(file.file.name)}</div>
                                    <div className='file-info'>
                                        <h4 className='file-name'>{file.file.name}</h4>
                                        <p className='file-status'>File Uploaded Successfully</p>
                                        <p className='word-count'>Word Count: {file.wordCount}</p>
                                    </div>
                                    <button className='cancel-btn' onClick={() => removeFile(file.id, file.wordCount) }>Cancel Upload</button>
                                </div>
                             ))}
                        </div> 
    

    if (!sourceLanguage) {
        return (
            <>
            {uploadedDoc}
            <div style={{textAlign:'center'}} className='uplaodFiles'>
               {uploadIcon}
                <p className='first'>Please select a source language first</p>
                <p className='supportFile'>Supported files</p>
               <img src={supportIcons} alt="support-files-icons" />
            </div>
            </>
        );
    }

    return (
        <>
        {uploadedDoc}
        <div className='uplaodFiles' style={{cursor: 'pointer'}}>
            <div style={{textAlign:'center'}} {...getRootProps()}>
                <input {...getInputProps()} />
                <p className='first'>Drag and drop some files here, or click to select files</p>
                <p className='supportFile'>Supported files</p>
                <img src={supportIcons} alt="support-files-icons" />
            </div>
            {showAllFiles} 
        </div>
        </>
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

export { countWords };


