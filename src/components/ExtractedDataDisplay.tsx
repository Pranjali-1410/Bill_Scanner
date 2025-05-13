
import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ExtractedDataProps {
  data: Record<string, any> | null;
  onSaveToDatabase: () => void;
  isSaving: boolean;
}

const ExtractedDataDisplay = ({ data, onSaveToDatabase, isSaving }: ExtractedDataProps) => {
  const { toast } = useToast();

  if (!data) return null;

  // Filter out array data that we don't want to display in the main table
  const filteredData = Object.entries(data).filter(
    ([key]) => key !== 'First 5 Customer Rows' && key !== 'Footer Block'
  );

  const handleSave = () => {
    try {
      onSaveToDatabase();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save to database. Please try again.",
        variant: "destructive",
      });
    }
  };

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
          onClick={handleSave}
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
