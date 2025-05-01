
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import Sidebar from '@/components/Sidebar';
import DatabaseActions from '@/components/DatabaseActions';
import DatabaseTable from '@/components/DatabaseTable';
import ColumnSelector from '@/components/ColumnSelector';
import RecentFiles from '@/components/RecentFiles';
import FileUpload from '@/components/FileUpload';

const Dashboard = () => {
  const { toast } = useToast();
  
  const availableColumns = [
    'ID', 
    'Page No.', 
    'Bill Date', 
    'Total Amount', 
    'Bank Name', 
    'Swift Code', 
    'UPI ID', 
    'Upload Date Time', 
    'Invoice Date', 
    'Tax Invoice No', 
    'GST No'
  ];
  
  // Default selected columns
  const [selectedColumns, setSelectedColumns] = useState([
    'ID', 
    'Page No.', 
    'Bill Date', 
    'Total Amount', 
    'Bank Name', 
    'Swift Code', 
    'UPI ID', 
    'Upload Date Time', 
    'Invoice Date'
  ]);
  
  const recentFiles = [
    { name: 'Electricity Bills', createdDays: 3 },
    { name: 'Invoice No 5686', createdDays: 10 },
    { name: 'Invoice No 1124', createdDays: 10 }
  ];
  
  const handleColumnToggle = (column: string) => {
    if (selectedColumns.includes(column)) {
      setSelectedColumns(selectedColumns.filter(col => col !== column));
      toast({ description: `Column "${column}" removed` });
    } else {
      setSelectedColumns([...selectedColumns, column]);
      toast({ description: `Column "${column}" added` });
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      
      <div className="main-content">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-kpmg-purple mb-2">Database Preview</h1>
        </div>
        
        <div className="mb-6">
          <FileUpload />
        </div>
        
        <div className="mb-8">
          <DatabaseActions />
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-3/4">
            <h2 className="text-xl font-semibold text-kpmg-purple mb-4">Preview of Database</h2>
            <DatabaseTable selectedColumns={selectedColumns} />
          </div>
          
          <div className="w-full md:w-1/4 space-y-6">
            <RecentFiles files={recentFiles} />
            <ColumnSelector 
              availableColumns={availableColumns}
              selectedColumns={selectedColumns}
              onColumnToggle={handleColumnToggle}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
