
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useFileUpload } from '@/contexts/FileUploadContext';
import { useToast } from "@/hooks/use-toast";
import { saveToDatabase } from '@/services/fileService';

interface ExtractedDataProps {
  onSaveToDatabase?: () => void;
}

const ExtractedDataDisplay = ({ onSaveToDatabase }: ExtractedDataProps) => {
  const { extractedData, isSaving, setIsSaving, selectedFile } = useFileUpload();
  const { toast } = useToast();
  
  // Move the save function directly into this component
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
      if (onSaveToDatabase) {
        setTimeout(() => {
          onSaveToDatabase();
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

  if (!extractedData) return null;

  // Filter out array data that we don't want to display in the main table
  const filteredData = Object.entries(extractedData).filter(
    ([key]) => key !== 'First 5 Customer Rows' && key !== 'Footer Block'
  );

  return (
    <div className="mt-8 border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Extracted Document Data</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell className="font-medium">Field</TableCell>
              <TableCell className="font-medium">Value</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map(([key, value]) => (
              <TableRow key={key}>
                <TableCell className="font-medium">{key.replace(/_/g, ' ')}</TableCell>
                <TableCell>{String(value)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4">
        <Button 
          onClick={handleSaveToDatabase}
          disabled={isSaving}
          className="bg-kpmg-blue hover:bg-kpmg-blue/90 text-white"
        >
          {isSaving ? "Saving..." : "Save to Database"}
        </Button>
      </div>
    </div>
  );
};

export default ExtractedDataDisplay;
