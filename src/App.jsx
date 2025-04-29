import React, { useState } from 'react';
import LanguageSelector from './components/LanguageSelector';
import FileUploader from './components/FileUploader';
import UploadedFiles from './components/UploadedFiles';
import './App.css';

export default function App() {
    const [sourceLanguage, setSourceLanguage] = useState(null);
    const [targetLanguages, setTargetLanguages] = useState([]);
    const [files, setFiles] = useState([]);
    const [totalWords, setTotalWords] = useState(0);

    return (
        <div className='ftlContainer'>
            <h2>Translation Uploader</h2>
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
                setTotalWords={setTotalWords}
            />
            <h3>Total Word Count: {totalWords}</h3>
            <h3>Total USD: ${totalWords}</h3>
        </div>
    );
}



