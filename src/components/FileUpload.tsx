
import { useState } from 'react';
import { Upload, Scan } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
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
    
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      toast({ description: `File ${selectedFile.name} uploaded successfully` });
      setSelectedFile(null);
    }, 1500);
  };
  
  const handleScan = () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please upload a file first",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate scan process
    toast({ description: "Scanning file... This will connect to backend API in the future" });
  };
  
  return (
    <div className="bg-white p-4 rounded-md shadow-sm">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex-1">
          <input
            type="file"
            id="fileUpload"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
          />
          <label 
            htmlFor="fileUpload" 
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <Upload size={18} />
            <span>{selectedFile ? selectedFile.name : "Choose file"}</span>
          </label>
        </div>
        
        <button 
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="px-4 py-2 bg-kpmg-purple text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 transition-colors"
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
        
        <button 
          onClick={handleScan}
          disabled={!selectedFile}
          className="px-4 py-2 bg-green-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 transition-colors flex items-center gap-2"
        >
          <Scan size={18} />
          <span>Scan</span>
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
