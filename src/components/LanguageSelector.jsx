import React from 'react';
import Select from 'react-select';

const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'bn', label: 'Bengali' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'es', label: 'Spanish' },
    { value: 'hi', label: 'Hindi' },
];

export default function LanguageSelector({ sourceLanguage, setSourceLanguage, targetLanguages, setTargetLanguages }) {
    return (
        <div style={{ marginBottom: "20px" }}>
            <label>Source Language:</label>
            <Select
                options={languageOptions}
                value={sourceLanguage}
                onChange={setSourceLanguage}
                placeholder="Select source language"
            />
            <br />
            <label>Target Languages:</label>
            <Select
                options={languageOptions}
                value={targetLanguages}
                onChange={setTargetLanguages}
                isMulti
                placeholder="Select target languages"
            />
        </div>
    );
}
