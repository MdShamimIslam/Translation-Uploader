import React from 'react';

export default function UploadedFiles({ files, setFiles, setTotalWords }) {
    const removeFile = (id, wordCount) => {
        setFiles(prev => prev.filter(file => file.id !== id));
        setTotalWords(prev => prev - wordCount);
    };

    return (
        <div style={{ marginBottom: "20px" }}>
            <h4>Uploaded Files:</h4>
            {files.length === 0 ? (
                <p>No files uploaded yet.</p>
            ) : (
                <ul>
                    {files.map(({ id, file, wordCount }) => (
                        <li key={id}>
                            {file.name} - {wordCount} words
                            <button style={{ marginLeft: "10px" }} onClick={() => removeFile(id, wordCount)}>Remove</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
