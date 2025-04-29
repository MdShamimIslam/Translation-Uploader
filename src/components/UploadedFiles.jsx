import React from 'react';
import { useDropzone } from 'react-dropzone';
import { useFileUpload } from '../utils/dropzoneConfig';

export default function UploadedFiles({ files, setFiles, totalWords, setTotalWords }) {
    const { getRootProps, getInputProps } = useDropzone(useFileUpload(setFiles, setTotalWords));
    
    const removeFile = (id, wordCount) => {
        setFiles(prev => prev.filter(file => file.id !== id));
        setTotalWords(prev => prev - wordCount);
    };

    return (
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
                <p className='totalUSD'>Total USD: <span className='sameClr'>{totalWords}</span></p>
            </div>
        </div>
    );
}
