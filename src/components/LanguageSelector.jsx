import React, { useState } from 'react';
import { languageOptions } from '../utils/options';

export default function LanguageSelector({ sourceLanguage, setSourceLanguage, targetLanguages, setTargetLanguages }) {
    const [showSourcePopup, setShowSourcePopup] = useState(false);
    const [showTargetPopup, setShowTargetPopup] = useState(false);

    const handleSourceSelect = (lang) => {
        setSourceLanguage(lang);
        setShowSourcePopup(false);
        setTargetLanguages([]); // Reset target languages when source changes
    };

    const handleTargetSelect = (lang) => {
        if (targetLanguages.find(tl => tl.value === lang.value)) {
            setTargetLanguages(targetLanguages.filter(tl => tl.value !== lang.value));
        } else {
            setTargetLanguages([...targetLanguages, lang]);
        }
    };

    return (
        <div className='languageSelectorWrapper'>
            <div className='sourceLang'>
                <p>1</p>
                <span>Select Languages</span>
            </div>
            <p className='originalLang'>
                Select the original language of the text you would like translated and select the target language of the language you would like the text translated to.
            </p>
            <div className='langSl'>
                <div className='sourceLan'>
                    <label>Source Language:</label>
                    <div 
                        className="language-input"
                        onClick={() => setShowSourcePopup(true)}
                    >
                        {sourceLanguage ? sourceLanguage.label : "Select source language"}
                    </div>

                    {showSourcePopup && (
                        <div className="language-popup">
                            <div className="popup-header">
                                <h3>Select Source languages (You can select one)</h3>
                                <button onClick={() => setShowSourcePopup(false)}>×</button>
                            </div>
                            <div className="language-grid">
                                {languageOptions.map(lang => (
                                    <button
                                        key={lang.value}
                                        onClick={() => handleSourceSelect(lang)}
                                        className={sourceLanguage?.value === lang.value ? 'selected' : ''}
                                    >
                                        {lang.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className='sourceLan'>
                    <label>Target Languages:</label>
                    <div 
                        className="language-input"
                        onClick={() => {
                            if (!sourceLanguage) {
                                Swal.fire({
                                    title: 'Warning!',
                                    text: 'Please select a source language first',
                                    icon: 'warning',
                                    confirmButtonColor: '#3085d6',
                                });
                                return;
                            }
                            setShowTargetPopup(true);
                        }}
                    >
                        {targetLanguages.length 
                            ? targetLanguages.map(lang => lang.label).join(', ')
                            : "Select target languages"
                        }
                    </div>

                    {showTargetPopup && (
                        <div className="language-popup">
                            <div className="popup-header">
                                <h3>Select target languages (You can select multiple)</h3>
                                <button onClick={() => setShowTargetPopup(false)}>×</button>
                            </div>
                            <div className="language-grid">
                                {languageOptions
                                    .filter(lang => lang.value !== sourceLanguage?.value)
                                    .map(lang => (
                                        <button
                                            key={lang.value}
                                            onClick={() => handleTargetSelect(lang)}
                                            className={targetLanguages.find(tl => tl.value === lang.value) ? 'selected' : ''}
                                        >
                                            {lang.label}
                                        </button>
                                    ))
                                }
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
