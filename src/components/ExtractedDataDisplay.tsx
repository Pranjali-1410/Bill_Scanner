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
  // Keep only fields that are relevant to the database schema
  const relevantFields = [
    'ACC_No', 'Stand_No', 'Street_No', 'Stand_valuation', 'Route_No',
    'Deposit', 'Guarantee', 'Acc_Date', 'Improvements', 'Payments_up_to',
    'VAT_Reg_No', 'Balance_B_F', 'Payments', 'Sub_total', 'Month_total',
    'Total_due', 'Over_90', 'Ninety_days', 'Sixty_days', 'Thirty_days',
    'Current', 'Due_Date'
  ];
  
  // Convert the data to a format suitable for display
  const displayData = Object.entries(data).filter(
    ([key]) => {
      // Include the field if it's in our relevant fields list or
      // if it's not one of the special arrays we want to exclude
      return relevantFields.includes(key) || 
            (key !== 'First 5 Customer Rows' && 
             key !== 'Footer Block' && 
             !Array.isArray(data[key]));
    }
  );

  const handleSave = () => {
    try {
      // Display a toast notification before attempting to save
      toast({
        title: "Processing",
        description: "Saving data to database...",
      });
      
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
            {displayData.map(([key, value]) => (
              <TableRow key={key}>
                <TableCell className="font-medium">{key.replace(/_/g, ' ')}</TableCell>
                <TableCell>{String(value !== null ? value : 'N/A')}</TableCell>
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
