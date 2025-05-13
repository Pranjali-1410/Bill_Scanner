
import { useState, useEffect } from 'react';
import { getBackendUrl } from '@/utils/apiUtils';
import Header from '@/components/Dashboard/Header';
import SearchBar from '@/components/Dashboard/SearchBar';
import ActionTabs from '@/components/Dashboard/ActionTabs';
import { RecentFile } from '@/types/files';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("database");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Available column options - expanded with Python backend fields
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
    'gstNo',
    // Python backend fields
    'Stand No',
    'Street No',
    'Stand valuation',
    'ACC No',
    'Route No',
    'Deposit',
    'Guarantee',
    'Acc Date',
    'Improvements',
    'Payments up to',
    'VAT Reg No',
    'Balance B/F',
    'Payments',
    'Sub total',
    'Month total',
    'Total due',
    'Over 90',
    '90 days',
    '60 days',
    '30 days',
    'Current',
    'Due Date'
  ];
  
  // Default selected columns with localStorage persistence
  const [selectedColumns, setSelectedColumns] = useState<string[]>(() => {
    const savedColumns = localStorage.getItem('selectedColumns');
    return savedColumns ? JSON.parse(savedColumns) : [
      'id',
      'fileName',
      'ACC No',
      'Stand No',
      'Street No',
      'Total due',
      'Due Date'
    ];
  });
  
  // Save selected columns to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('selectedColumns', JSON.stringify(selectedColumns));
  }, [selectedColumns]);
  
  // Fetch recent files from backend
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([
    { name: 'Electricity Bills', createdDays: 3 },
    { name: 'Invoice No 5686', createdDays: 10 },
    { name: 'Invoice No 1124', createdDays: 10 }
  ]);

  const BACKEND_URL = getBackendUrl();

  // Fetch real recent files from the uploads directory
  useEffect(() => {
    const fetchRecentFiles = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/recent-files`, {
          // Add credentials to handle CORS properly
          credentials: 'include',
          // Add appropriate headers
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success && Array.isArray(data.files)) {
            setRecentFiles(data.files);
          }
        } else {
          console.error('Failed to fetch recent files. Status:', response.status);
        }
      } catch (error) {
        console.error('Failed to fetch recent files:', error);
        // Use fallback data if fetch fails
        setRecentFiles([
          { name: 'Electricity Bills (Fallback)', createdDays: 3 },
          { name: 'Invoice No 5686 (Fallback)', createdDays: 10 },
          { name: 'Invoice No 1124 (Fallback)', createdDays: 10 }
        ]);
      }
    };
    
    fetchRecentFiles();
  }, [refreshTrigger, BACKEND_URL]);
  
  const handleColumnToggle = (column: string) => {
    if (selectedColumns.includes(column)) {
      setSelectedColumns(selectedColumns.filter(col => col !== column));
    } else {
      setSelectedColumns([...selectedColumns, column]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Database Dashboard</h1>
        
        <SearchBar />
        
        <ActionTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedColumns={selectedColumns}
          availableColumns={availableColumns}
          handleColumnToggle={handleColumnToggle}
          refreshTrigger={refreshTrigger}
          recentFiles={recentFiles}
        />
      </main>
    </div>
  );
};

export default Dashboard;
