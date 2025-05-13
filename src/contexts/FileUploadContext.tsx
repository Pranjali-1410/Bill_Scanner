
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface FileUploadContextProps {
  selectedFile: File | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
  uploadedFilePath: string | null;
  setUploadedFilePath: React.Dispatch<React.SetStateAction<string | null>>;
  extractedData: any | null;
  setExtractedData: React.Dispatch<React.SetStateAction<any | null>>;
  isUploading: boolean;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
  isScanning: boolean;
  setIsScanning: React.Dispatch<React.SetStateAction<boolean>>;
  isSaving: boolean;
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
}

const FileUploadContext = createContext<FileUploadContextProps | undefined>(undefined);

export const FileUploadProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFilePath, setUploadedFilePath] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<any | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  return (
    <FileUploadContext.Provider value={{
      selectedFile,
      setSelectedFile,
      uploadedFilePath,
      setUploadedFilePath,
      extractedData,
      setExtractedData,
      isUploading,
      setIsUploading,
      isScanning,
      setIsScanning,
      isSaving,
      setIsSaving,
    }}>
      {children}
    </FileUploadContext.Provider>
  );
};

export const useFileUpload = () => {
  const context = useContext(FileUploadContext);
  if (context === undefined) {
    throw new Error('useFileUpload must be used within a FileUploadProvider');
  }
  return context;
};
