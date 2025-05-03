import {useState} from 'react';
import { useDropzone } from 'react-dropzone';
import { useFileUpload } from '../utils/dropzoneConfig';

export default function UploadedFiles({ files, setFiles, totalWords, setTotalWords, sourceLanguage={}, targetLanguages=[], selectedCategory = '' }) {
    const { getRootProps, getInputProps } = useDropzone(useFileUpload(setFiles, setTotalWords));
    const [showAllFilesList, setShowAllFilesList] = useState(false);

    console.log(selectedCategory);

    const handleBuyNow = () => {
        const formData = new FormData();

        files.forEach(fileObj => {
            formData.append('files[]', fileObj.file);
        });

        formData.append('totalWords', totalWords);
        formData.append('totalUSD', totalWords * targetLanguages?.length);
        formData.append('sourceLang', sourceLanguage?.label || '');
        formData.append('targetLang', targetLanguages?.map(lang => lang.label).join(', ') || ''); 

        fetch(translationUploaderAjax.ajaxurl + '?action=ftl_handle_buy_now', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.success && data.data.redirect_url) {
                window.location.href = data.data.redirect_url;
            } else {
                alert('Something went wrong!');
            }
        });
    };
    
    return (
        <div>
            <div className='showUploadedFiles'>
                <div className='showUploadedFilesChild1'>
                {files?.length > 0 ? (
                        <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <button>Add More</button>
                        </div>
                ) : ''} 
                    <p>Uploaded {files?.length > 1 ? 'Files' : 'File'} : <span className='sameClr'>{files?.length}</span></p>
                </div>
                <div>
                    <p className='totalWords'>Total Word Count: <span className='sameClr'>{totalWords}</span></p>
                    <p className='totalUSD'>Total USD: <span className='sameClr'>{totalWords * targetLanguages?.length}</span></p>
                </div>
                <button className="buyNow" onClick={handleBuyNow}>Buy Now</button>
            </div>

           {files?.length > 0 && <button onClick={ () => setShowAllFilesList(prev => !prev)} className='showUploadedFile'>
               {showAllFilesList ? 'Hide Uploaded File(s)' : 'Show Uploaded File(s)'} 
            </button> } 

           {showAllFilesList && files?.length > 0 ? <>
            <div className='showAllLoadedFiles'>
                {files?.map((file) => (
                    <div key={file.id} className='file-card'>
                            <p className='file-name'>{file.file.name}</p>
                            <p className='word-count'>Total Word Count: {file.wordCount}</p> 
                            <p className='word-count'>Total USD: {file.wordCount * targetLanguages?.length}</p> 
                    </div>
                ))}
            </div>
           </> : '' }

        </div>
    );
}
