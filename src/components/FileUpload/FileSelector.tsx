
import React from 'react';
import { Upload } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useFileUpload } from '@/contexts/FileUploadContext';
import { Button } from '@/components/ui/button';

const FileSelector: React.FC = () => {
  const { toast } = useToast();
  const { 
    selectedFile, 
    setSelectedFile, 
    setUploadedFilePath,
    setExtractedData 
  } = useFileUpload();

  const allowedFileTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    
    if (!allowedFileTypes.includes(file.type)) {
      toast({
        title: "Error",
        description: "Only PDF, JPG, JPEG and PNG files are supported",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedFile(file);
    setUploadedFilePath(null);
    setExtractedData(null);
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center">
      <div className="text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm font-medium text-gray-700">
          Drag and drop your files here
        </p>
        <p className="text-xs text-gray-500">or</p>
        <div className="mt-4">
          <input
            type="file"
            id="fileUpload"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
          />
          <label
            htmlFor="fileUpload"
            className="inline-flex cursor-pointer px-4 py-2 bg-kpmg-blue text-white rounded-md hover:bg-kpmg-blue/90 transition-colors"
          >
            Browse Files
          </label>
          
          {selectedFile && (
            <p className="mt-4 text-sm text-gray-700">Selected: {selectedFile.name}</p>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-4">Supported files: PDF, JPG, JPEG, PNG</p>
      </div>
    </div>
  );
};

export default FileSelector;
