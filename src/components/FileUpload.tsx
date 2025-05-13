
import React from 'react';
import { FileUploadProvider } from '@/contexts/FileUploadContext';
import FileSelector from './FileUpload/FileSelector';
import FileActions from './FileUpload/FileActions';
import ExtractedDataDisplay from './ExtractedDataDisplay';
import { useFileUpload } from '@/contexts/FileUploadContext';

interface FileUploadProps {
  onDataSaved?: () => void;
}

// Internal component that uses the context
const FileUploadContent = ({ onDataSaved }: FileUploadProps) => {
  const { selectedFile, extractedData } = useFileUpload();
  
  return (
    <>
      <h2 className="text-xl font-semibold mb-6">File Upload</h2>
      
      <FileSelector />
      
      {selectedFile && (
        <div className="mt-4 flex justify-center">
          <FileActions />
        </div>
      )}
      
      {/* Display extracted data if available */}
      {extractedData && (
        <ExtractedDataDisplay onSaveToDatabase={onDataSaved} />
      )}
    </>
  );
};

// Wrapper component that provides the context
const FileUpload = (props: FileUploadProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <FileUploadProvider>
        <FileUploadContent {...props} />
      </FileUploadProvider>
    </div>
  );
};

export default FileUpload;
