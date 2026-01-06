import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
// eslint-disable-next-line import/no-unresolved
import { v4 as uuidv4 } from 'uuid';
import { EmailFile } from './types';
import './index.scss';
// Import the type definition file to trigger the global declaration

const App = () => {
  const [files, setFiles] = useState<EmailFile[]>([]);
  const [loading, setLoading] = useState(false);

const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    // We can't map directly because we need to call the window API for each file
    const droppedFiles = Array.from(e.dataTransfer.files).map((f) => {
      // Use the new secure helper to get the path
      const filePath = window.electronAPI.getFilePath(f);
      
      return {
        id: uuidv4(),
        name: f.name,
        path: filePath, // Use the retrieved path
        recipient: '',
        cc: '',
        subject: `File: ${f.name}`,
        body: 'Please find the attached file.',
      };
    });

    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const updateFile = (id: string, field: keyof EmailFile, value: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    );
  };

  const handleCreateDrafts = async () => {
    setLoading(true);
    try {
      const result = await window.electronAPI.createDrafts(files); // STILL error: Property 'electronAPI' does not exist on type 'Window & typeof globalThis'. Did you mean 'Electron'?ts(2551) electron.d.ts(12, 19): 'Electron' is declared here.
      alert(result);
    } catch (error) {
      alert('Error creating drafts: ' + error);
    }
    setLoading(false);
  };

  return (
    <div className="container" onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}> 
      <h1>File GMailer</h1>
      
      <div className="drop-zone">
        <p>Drag & Drop files here</p>
      </div>

      <div className="file-list">
        {files.map((file) => (
          <div key={file.id} className="file-card">
            <h3>{file.name}</h3>
            <input 
              placeholder="Recipient" 
              value={file.recipient} 
              onChange={(e) => updateFile(file.id, 'recipient', e.target.value)} 
            />
            <input 
              placeholder="Subject" 
              value={file.subject} 
              onChange={(e) => updateFile(file.id, 'subject', e.target.value)} 
            />
             {/* Add CC and Body inputs similarly */}
          </div>
        ))}
      </div>

      <button onClick={handleCreateDrafts} disabled={loading || files.length === 0}>
        {loading ? 'Processing...' : `Create ${files.length} Drafts`}
      </button>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}