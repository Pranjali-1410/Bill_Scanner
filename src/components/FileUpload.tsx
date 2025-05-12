
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
  
  // Define backend URL that works both in development and when deployed
  const BACKEND_URL = import.meta.env.PROD 
    ? (window.location.protocol + '//' + window.location.hostname + ':5000') // Use same host with port 5000
    : 'http://localhost:5000'; // Default for development
  
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
      
      console.log("Uploading to:", `${BACKEND_URL}/upload`);
      // Send to backend with timeout and proper error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch(`${BACKEND_URL}/upload`, {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
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
      let errorMessage = "Server connection failed. ";
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage += "Request timed out after 30 seconds.";
        } else {
          errorMessage += error.message;
        }
      }
      
      errorMessage += " Make sure the backend server is running at " + BACKEND_URL;
      
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
      // Send to scan endpoint with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout for scanning
      
      const response = await fetch(`${BACKEND_URL}/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filePath: uploadedFilePath }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch(`${BACKEND_URL}/upload-bill`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(extractedData),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Failed to save to database with status: ${response.status}`);
      }
      
      await response.json();
      
      toast({ 
        title: "Success",
        description: "Bill data saved to database successfully"
      });
      
    } catch (error) {
      console.error('Database save error:', error);
      let errorMessage = "Database save failed. ";
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage += "Request timed out after 30 seconds.";
        } else {
          errorMessage += error.message;
        }
      }
      
      toast({
        title: "Save Failed",
        description: errorMessage,
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
