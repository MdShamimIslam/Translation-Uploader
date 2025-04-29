import React from 'react';
import Select from 'react-select';
import { languageOptions } from '../utils/options';

export default function LanguageSelector({ sourceLanguage, setSourceLanguage, targetLanguages, setTargetLanguages }) {
    const targetOptions = languageOptions.filter(lang => 
        !sourceLanguage || lang.value !== sourceLanguage.value
    );

    return (
       <div className='languageSelectorWrapper'>
        <div className='sourceLang'>
            <p>1</p>
            <span>Select Langauges</span>
        </div>
        <p className='originalLang'>
           Select the original language of the text you would like translated and select the target language of the language you would like the text translated to from our drop-down menu.
        </p>
         <div className='langSl'>
            <div className='sourceLan'>
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
            </div>
           <div className='sourceLan'>
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
        </div>
       </div>
    );
}
