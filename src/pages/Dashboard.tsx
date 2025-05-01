
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Database,
  Upload,
  Settings,
  Search,
  FileText,
} from 'lucide-react';
import DatabaseTable from '@/components/DatabaseTable';
import RecentFiles from '@/components/RecentFiles';
import FileUpload from '@/components/FileUpload';

const Dashboard = () => {
  const { toast } = useToast();
  const userName = "PRANJALI YADAV";
  const [activeTab, setActiveTab] = useState("database");

  // Available column options
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
    } else {
      setSelectedColumns([...selectedColumns, column]);
    }
  };

  const DatabaseActionCard = ({ icon: Icon, title, active }: { icon: any, title: string, active: boolean }) => (
    <div className={`text-center py-5 px-3 rounded-lg cursor-pointer transition-colors ${active ? 'bg-kpmg-blue' : 'bg-kpmg-blue bg-opacity-80 hover:bg-opacity-90'}`}>
      <div className="flex justify-center mb-2">
        <Icon size={36} color="white" />
      </div>
      <h3 className="text-lg font-medium text-white uppercase">{title}</h3>
    </div>
  );

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
              <Search size={18} />
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
        
        {/* Action Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-3 bg-gray-100 p-0 gap-4">
            <TabsTrigger value="database" className="data-[state=active]:bg-kpmg-blue data-[state=active]:text-white">
              <div className="p-3">
                <div className="flex justify-center mb-2">
                  <Database size={28} className="data-[state=active]:text-white" />
                </div>
                <h3 className="text-md font-medium uppercase">View Database</h3>
              </div>
            </TabsTrigger>
            <TabsTrigger value="upload" className="data-[state=active]:bg-kpmg-blue data-[state=active]:text-white">
              <div className="p-3">
                <div className="flex justify-center mb-2">
                  <Upload size={28} className="data-[state=active]:text-white" />
                </div>
                <h3 className="text-md font-medium uppercase">Upload Files</h3>
              </div>
            </TabsTrigger>
            <TabsTrigger value="master" className="data-[state=active]:bg-kpmg-blue data-[state=active]:text-white">
              <div className="p-3">
                <div className="flex justify-center mb-2">
                  <Settings size={28} className="data-[state=active]:text-white" />
                </div>
                <h3 className="text-md font-medium uppercase">Master Table</h3>
              </div>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="mt-6">
            <FileUpload />
          </TabsContent>
          
          <TabsContent value="database" className="mt-6">
            {/* Main Content */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-3/4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <DatabaseTable selectedColumns={selectedColumns} />
                </div>
              </div>
              
              <div className="w-full md:w-1/4 space-y-6">
                {/* Column Selector */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
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
          </TabsContent>
          
          <TabsContent value="master" className="mt-6">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <h3 className="text-xl font-medium">Master Table Coming Soon</h3>
              <p className="text-gray-500 mt-2">This feature is under development.</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
