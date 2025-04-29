import React from 'react';
import Select from 'react-select';
import { languageOptions } from '../utils/options';

export default function LanguageSelector({ sourceLanguage, setSourceLanguage, targetLanguages, setTargetLanguages }) {
    const targetOptions = languageOptions.filter(lang => 
        !sourceLanguage || lang.value !== sourceLanguage.value
    );

    return (
        <div style={{ marginBottom: "20px" }}>
            <label>Source Language:</label>
            <Select
                options={languageOptions}
                value={sourceLanguage}
                onChange={(selected) => {
                    setSourceLanguage(selected);
                    setTargetLanguages([]);
                }}
                placeholder="Select source language"
            />
            <br />
            <label>Target Languages:</label>
            <Select
                options={targetOptions}
                value={targetLanguages}
                onChange={setTargetLanguages}
                isMulti
                placeholder="Select target languages"
                isDisabled={!sourceLanguage}
            />
        </div>
    );
}
