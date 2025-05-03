import React, { useState } from 'react';
import FileUploader from './components/FileUploader';
import './App.css';
import LanguageSelector from './components/LanguageSelector';
import UploadedFiles from './components/uploadedfiles';

export default function App() {
    const [sourceLanguage, setSourceLanguage] = useState(null);
    const [targetLanguages, setTargetLanguages] = useState([]);
    const [files, setFiles] = useState([]);
    const [totalWords, setTotalWords] = useState(0);

    console.log( 'App', sourceLanguage, targetLanguages);

    

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
                targetLanguages={targetLanguages}
            />
            
            <UploadedFiles
                files={files}
                setFiles={setFiles}
                totalWords={totalWords}
                setTotalWords={setTotalWords}
                sourceLanguage={sourceLanguage}
                targetLanguages={targetLanguages}
            />
        </div>
    );
}



