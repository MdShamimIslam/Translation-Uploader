import React, { useState } from 'react';
import LanguageSelector from './components/LanguageSelector';
import FileUploader from './components/FileUploader';
import UploadedFiles from './components/UploadedFiles';

export default function App() {
    const [sourceLanguage, setSourceLanguage] = useState(null);
    const [targetLanguages, setTargetLanguages] = useState([]);
    const [files, setFiles] = useState([]);
    const [totalWords, setTotalWords] = useState(0);

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
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
            <h3>Total Words: {totalWords}</h3>
        </div>
    );
}



