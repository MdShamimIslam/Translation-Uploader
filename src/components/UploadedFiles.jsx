import {useState} from 'react';
import { useDropzone } from 'react-dropzone';
import { useFileUpload } from '../utils/dropzoneConfig';

export default function UploadedFiles({ files, setFiles, totalWords, setTotalWords }) {
    const { getRootProps, getInputProps } = useDropzone(useFileUpload(setFiles, setTotalWords));
    const [showAllFilesList, setShowAllFilesList] = useState(false);

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
                    <p className='totalUSD'>Total USD: <span className='sameClr'>{totalWords}</span></p>
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
                            <p className='word-count'>Total USD: {file.wordCount}</p> 
                    </div>
                ))}
                <button className='buyNow'>Buy Now</button>
            </div>
           </> : '' }
        </div>
    );
}
