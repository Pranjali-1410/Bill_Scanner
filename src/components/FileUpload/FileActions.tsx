
import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Scan } from 'lucide-react';
import { useFileUpload } from '@/contexts/FileUploadContext';
import { uploadFile, scanDocument } from '@/services/fileService';

const FileActions: React.FC = () => {
  const { toast } = useToast();
  const { 
    selectedFile, 
    uploadedFilePath, 
    setUploadedFilePath,
    setExtractedData,
    isUploading,
    setIsUploading,
    isScanning,
    setIsScanning
  } = useFileUpload();

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a file first",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      const data = await uploadFile(selectedFile);
      setUploadedFilePath(data.filePath);
      
      toast({ 
        description: `File ${selectedFile.name} uploaded successfully` 
      });
    } catch (error) {
      console.error('Upload error:', error);
      let errorMessage = "Server connection failed. ";
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage += "Request timed out after 30 seconds.";
        } else {
          errorMessage += error.message;
        }
      }
      
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleScan = async () => {
    if (!uploadedFilePath) {
      toast({
        title: "Error",
        description: "Please upload a file first",
        variant: "destructive",
      });
      return;
    }
    
    setIsScanning(true);
    
    try {
      const data = await scanDocument(
        uploadedFilePath, 
        selectedFile ? selectedFile.name : null
      );
      
      if (!data.success) {
        throw new Error(data.error || "Scanning failed");
      }
      
      // Make sure we include the original filename in extracted data
      if (selectedFile) {
        data.results.file_name = selectedFile.name;
      }
      
      setExtractedData(data.results);
      
      toast({ 
        description: "Document scanned successfully! Data extracted." 
      });
    } catch (error) {
      console.error('Scan error:', error);
      let errorMessage = "Scanning process failed. ";
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage += "Request timed out after 60 seconds.";
        } else {
          errorMessage += error.message;
        }
      }
      
      toast({
        title: "Scan Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  // Only show action buttons if a file is selected
  if (!selectedFile) {
    return null;
  }
  
  return (
    <div className="flex gap-4 mt-2">
      <Button 
        onClick={handleUpload}
        disabled={isUploading}
        className="bg-kpmg-blue hover:bg-kpmg-blue/90 text-white"
      >
        {isUploading ? "Uploading..." : "Upload"}
      </Button>
      
      <Button 
        onClick={handleScan}
        disabled={isScanning || !uploadedFilePath}
        className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
      >
        <Scan size={18} />
        <span>{isScanning ? "Scanning..." : "Scan"}</span>
      </Button>
    </div>
  );
};

export default FileActions;
