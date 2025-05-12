
import { useState } from 'react';
import { Upload, Scan } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import ExtractedDataDisplay from './ExtractedDataDisplay';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadedFilePath, setUploadedFilePath] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<any | null>(null);
  const { toast } = useToast();
  
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
      // Create form data
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      // Send to backend
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      setUploadedFilePath(data.filePath);
      
      toast({ 
        description: `File ${selectedFile.name} uploaded successfully` 
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Server error occurred",
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
      // Send to scan endpoint
      const response = await fetch('http://localhost:5000/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filePath: uploadedFilePath }),
      });
      
      if (!response.ok) {
        throw new Error(`Scan failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || "Scanning failed");
      }
      
      setExtractedData(data.results);
      
      toast({ 
        description: "Document scanned successfully! Data extracted." 
      });
    } catch (error) {
      console.error('Scan error:', error);
      toast({
        title: "Scan Failed",
        description: error instanceof Error ? error.message : "Error processing document",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleSaveToDatabase = async () => {
    if (!extractedData) {
      toast({
        title: "Error",
        description: "No data to save",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      const response = await fetch('http://localhost:5000/upload-bill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(extractedData),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to save to database with status: ${response.status}`);
      }
      
      const result = await response.json();
      
      toast({ 
        title: "Success",
        description: "Bill data saved to database successfully"
      });
      
    } catch (error) {
      console.error('Database save error:', error);
      toast({
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Error saving to database",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-6">File Upload</h2>
      
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
              <div className="mt-4">
                <p className="text-sm text-gray-700">Selected: {selectedFile.name}</p>
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
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-4">Supported files: PDF, JPG, JPEG, PNG</p>
        </div>
      </div>
      
      {/* Use the ExtractedDataDisplay component */}
      {extractedData && (
        <ExtractedDataDisplay 
          data={extractedData}
          onSaveToDatabase={handleSaveToDatabase}
          isSaving={isSaving}
        />
      )}
    </div>
  );
};

export default FileUpload;
