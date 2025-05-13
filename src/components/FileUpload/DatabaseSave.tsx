
import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { useFileUpload } from '@/contexts/FileUploadContext';
import { saveToDatabase } from '@/services/fileService';

interface DatabaseSaveProps {
  onDataSaved?: () => void;
}

const DatabaseSave: React.FC<DatabaseSaveProps> = ({ onDataSaved }) => {
  const { toast } = useToast();
  const { 
    selectedFile, 
    extractedData,
    isSaving,
    setIsSaving
  } = useFileUpload();

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
      // Make sure to include the original filename in the data we send
      const dataToSave = {
        ...extractedData,
        file_name: selectedFile ? selectedFile.name : undefined
      };
      
      console.log("Saving data to database:", dataToSave);
      await saveToDatabase(dataToSave);
      
      toast({ 
        title: "Success",
        description: "Bill data saved to database successfully"
      });

      // After successful save, switch to database tab if callback is provided
      if (onDataSaved) {
        setTimeout(() => {
          onDataSaved();
        }, 1500); // Short delay for user to see success message
      }
      
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

  return { handleSaveToDatabase };
};

export default DatabaseSave;
