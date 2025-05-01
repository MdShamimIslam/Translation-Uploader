import React, { useState } from 'react';
import LanguageSelector from './components/LanguageSelector';
import FileUploader from './components/FileUploader';
import UploadedFiles from './components/uploadedfiles';
import './App.css';

export default function App() {
    const [sourceLanguage, setSourceLanguage] = useState(null);
    const [targetLanguages, setTargetLanguages] = useState([]);
    const [files, setFiles] = useState([]);
    const [totalWords, setTotalWords] = useState(0);

    return (
        <div className='ftlContainer'>
            <LanguageSelector
                sourceLanguage={sourceLanguage}
                setSourceLanguage={setSourceLanguage}
                targetLanguages={targetLanguages}
                setTargetLanguages={setTargetLanguages}
            />
            <FileUploader
                files={files}
                setFiles={setFiles}
                setTotalWords={setTotalWords}
                sourceLanguage={sourceLanguage}
            />
            
            <UploadedFiles
                files={files}
                setFiles={setFiles}
                totalWords={totalWords}
                setTotalWords={setTotalWords}
            />
        </div>
    );
}



