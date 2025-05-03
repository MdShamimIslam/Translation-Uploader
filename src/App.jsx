import React, { useState } from 'react';
import FileUploader from './components/FileUploader';
import './App.css';
import LanguageSelector from './components/LanguageSelector';
import Category from './components/Category';
import UploadedFiles from './components/UploadedFiles';

export default function App() {
    const [sourceLanguage, setSourceLanguage] = useState(null);
    const [targetLanguages, setTargetLanguages] = useState([]);
    const [files, setFiles] = useState([]);
    const [totalWords, setTotalWords] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState(null)

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
                selectedCategory={selectedCategory}
            />

            <Category 
                selectedCategory={selectedCategory} 
                setSelectedCategory={setSelectedCategory} 
            />
        </div>
    );
}



