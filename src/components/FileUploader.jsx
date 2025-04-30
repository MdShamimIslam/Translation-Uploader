import React from 'react';
import Swal from 'sweetalert2';
import { useDropzone } from 'react-dropzone';
import { useFileUpload } from '../utils/dropzoneConfig';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import { uploadIcon } from '../utils/icons';
import supportIcons from '../assets/icons.png';
import { getFileIcon } from '../utils/dropzoneConfig';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function FileUploader({ files, setFiles, setTotalWords, sourceLanguage }) {

    const uploadToMediaLibrary = async (file) => {
        const formData = new FormData();
        formData.append('action', 'ftl_handle_file_upload');
        formData.append('file', file);
        formData.append('nonce', translationUploaderAjax.nonce);

        try {
            const response = await fetch(translationUploaderAjax.ajaxurl, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            
            if (data.success) {
                console.log('File uploaded to media library:', data.data.url);
            }
        } catch (error) {
            console.error('Error uploading to media library:', error);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        ...useFileUpload(setFiles, setTotalWords, uploadToMediaLibrary),
        disabled: !sourceLanguage
    });


    const removeFile = async (id, wordCount, fileName) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to remove "${fileName}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, remove it!'
        });

        if (result.isConfirmed) {
            setFiles(prev => prev.filter(file => file.id !== id));
            setTotalWords(prev => prev - wordCount);
            
            Swal.fire(
                'Removed!',
                'Your file has been removed.',
                'success'
            );
        }
    };

    // Keep this first showAllFiles definition
    const showAllFiles = <div className='showAllLoadedFiles'>
        {files?.map((file) => (
            <div key={file.id} className='file-card'>
                <div className='file-icon'>{getFileIcon(file.file.name)}</div>
                <div className='file-info'>
                    <h4 className='file-name'>{file.file.name}</h4>
                    <p className='file-status'>File Uploaded Successfully</p>
                    <p className='word-count'>Word Count: {file.wordCount}</p>
                </div>
                <button 
                    className='cancel-btn' 
                    onClick={() => removeFile(file.id, file.wordCount, file.file.name)}
                >
                    Cancel Upload
                </button>
            </div>
        ))}
    </div>

    const uploadedDoc =  <>
                        <div style={{marginTop:'20px'}} className='sourceLang'>
                                <p>2</p>
                                <span>Upload Document file(s)</span>
                        </div>
                        <p className='originalLang'>
                        It is extremely important to us that your files are secure with us.Your files are exclusively stored on servers in Hong Kong.All of our "In-house" translators sign NDA's(Non-disclosure argument)and we train them to follow secure working practices.
                        </p>
                    </>
    

    if (!sourceLanguage) {
        return (
            <>
            {uploadedDoc}
            <div style={{textAlign:'center'}} className='uplaodFiles'>
               {uploadIcon}
                <p className='first'>Please select a source language first</p>
                <p className='supportFile'>Supported files</p>
               <img src={supportIcons} alt="support-files-icons" />
            </div>
            </>
        );
    }

    return (
        <>
        {uploadedDoc}
        <div className='uplaodFiles' style={{cursor: 'pointer'}}>
            <div style={{textAlign:'center'}} {...getRootProps()}>
                <input {...getInputProps()} />
                <p className='first'>Drag and drop some files here, or click to select files</p>
                <p className='supportFile'>Supported files</p>
                <img src={supportIcons} alt="support-files-icons" />
            </div>
            {showAllFiles} 
        </div>
        </>
    );
}


