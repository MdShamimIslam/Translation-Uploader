import {useState} from 'react';
import { useDropzone } from 'react-dropzone';
import { useFileUpload } from '../utils/dropzoneConfig';
import Category from './Category';

export default function UploadedFiles({ files, setFiles, totalWords, setTotalWords, sourceLanguage={}, targetLanguages=[] }) {
    const { getRootProps, getInputProps } = useDropzone(useFileUpload(setFiles, setTotalWords));
    const [showAllFilesList, setShowAllFilesList] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);


    const handleBuyNow = () => {
        if (!selectedCategory) {
            Swal.fire({
                title: 'Category Required!',
                text: 'Please select a category for your translation text before proceeding to checkout.',
                icon: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            });
            return;
        }

        const formData = new FormData();

        files.forEach(fileObj => {
            formData.append('files[]', fileObj.file);
        });

        formData.append('totalWords', totalWords);
        formData.append('totalUSD', totalWords * targetLanguages?.length);
        formData.append('sourceLang', sourceLanguage?.label || '');
        formData.append('targetLang', targetLanguages?.map(lang => lang.label).join(', ') || ''); 
        formData.append('category', selectedCategory?.name || '');

        fetch(translationUploaderAjax.ajaxurl + '?action=ftl_handle_buy_now', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.success && data.data.redirect_url) {
                window.location.href = data.data.redirect_url;
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'Something went wrong with the checkout process.',
                    icon: 'error',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                });
            }
        })
        .catch(error => {
            Swal.fire({
                title: 'Error!',
                text: 'Failed to process your request. Please try again.',
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            });
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
                    <p className='totalUSD'>Total HKD: <span className='sameClr'>{totalWords * targetLanguages?.length}</span></p>
                </div>
               
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
                            <p className='word-count'>Total HKD: {file.wordCount * targetLanguages?.length}</p> 
                    </div>
                ))}
            </div>
           </> : '' }

           <Category 
                selectedCategory={selectedCategory} 
                setSelectedCategory={setSelectedCategory} 
            />

            <div className='checkoutBtn'>
                <button className="buyNow" onClick={handleBuyNow}>Continue To Checkout</button>
            </div>

        </div>
    );
}
