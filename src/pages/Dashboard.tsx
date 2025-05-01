
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Database, Upload, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import DatabaseTable from '@/components/DatabaseTable';
import ColumnSelector from '@/components/ColumnSelector';
import RecentFiles from '@/components/RecentFiles';
import FileUpload from '@/components/FileUpload';

const Dashboard = () => {
  const { toast } = useToast();
  const userName = "PRANJALI YADAV"; // Replace with actual user data later
  
  const availableColumns = [
    'id', 
    'fileName', 
    'billDate', 
    'totalAmount', 
    'bankName', 
    'swiftCode', 
    'upiId', 
    'uploadDateTime', 
    'invoiceDate', 
    'taxInvoiceNo', 
    'gstNo'
  ];
  
  // Default selected columns
  const [selectedColumns, setSelectedColumns] = useState([
    'id', 
    'fileName', 
    'billDate', 
    'totalAmount', 
    'bankName', 
    'swiftCode', 
    'upiId', 
    'uploadDateTime', 
    'invoiceDate'
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
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-kpmg-blue text-white py-4 px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-3xl font-bold mr-2">KPMG</div>
            <div className="text-xl ml-2">KPMG Portal</div>
          </div>
          <div className="flex items-center">
            <div className="mr-4">{userName}</div>
            <div className="bg-white text-kpmg-blue font-bold py-1 px-4 rounded">
              Logout
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Database Dashboard</h1>
        
        {/* Search Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1 max-w-md relative">
            <Input 
              type="text" 
              placeholder="Search records..." 
              className="pl-10 pr-4 py-2 w-full"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>
          <div>
            <button className="ml-2 p-2 border border-gray-300 rounded-md bg-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-kpmg-blue text-white p-6 rounded-md cursor-pointer hover:bg-opacity-90 transition-colors flex flex-col items-center justify-center">
            <Database size={36} className="mb-4" />
            <h3 className="text-xl font-semibold uppercase">View Database</h3>
          </div>
          
          <div className="bg-kpmg-blue text-white p-6 rounded-md cursor-pointer hover:bg-opacity-90 transition-colors flex flex-col items-center justify-center">
            <Upload size={36} className="mb-4" />
            <h3 className="text-xl font-semibold uppercase">Upload Files</h3>
          </div>
          
          <div className="bg-kpmg-blue text-white p-6 rounded-md cursor-pointer hover:bg-opacity-90 transition-colors flex flex-col items-center justify-center">
            <Settings size={36} className="mb-4" />
            <h3 className="text-xl font-semibold uppercase">Master Table</h3>
          </div>
        </div>
        
        {/* File Upload Section */}
        <div className="mb-8">
          <FileUpload />
        </div>
        
        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-3/4">
            <div className="bg-white p-4 rounded-md shadow-sm mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Database Preview</h2>
                <div className="flex gap-2">
                  <Button variant="destructive" className="bg-red-500 hover:bg-red-600 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                    Delete All
                  </Button>
                  <Button variant="outline" className="border-kpmg-blue text-kpmg-blue hover:bg-kpmg-blue hover:text-white flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add New
                  </Button>
                </div>
              </div>
              <DatabaseTable selectedColumns={selectedColumns} />
            </div>
          </div>
          
          <div className="w-full md:w-1/4 space-y-6">
            {/* Column Selector */}
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Table Columns</h3>
              <div className="space-y-2">
                {availableColumns.map((column, index) => (
                  <div key={index} className="flex items-center">
                    <Checkbox
                      id={`column-${index}`}
                      checked={selectedColumns.includes(column)}
                      onCheckedChange={() => handleColumnToggle(column)}
                      className="data-[state=checked]:bg-kpmg-blue data-[state=checked]:border-kpmg-blue"
                    />
                    <label htmlFor={`column-${index}`} className="ml-2 text-sm text-gray-700">
                      {column}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Recent Files */}
            <RecentFiles files={recentFiles} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
