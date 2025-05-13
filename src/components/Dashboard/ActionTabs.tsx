
import React from 'react';
import { Database, Upload, Settings } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from '@/components/ui/checkbox';
import FileUpload from '@/components/FileUpload';
import DatabaseTable from '@/components/DatabaseTable';
import RecentFiles from '@/components/RecentFiles';
import { RecentFile } from '@/types/files';

interface ActionTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedColumns: string[];
  availableColumns: string[];
  handleColumnToggle: (column: string) => void;
  refreshTrigger: number;
  recentFiles: RecentFile[];
}

const ActionTabs = ({
  activeTab,
  setActiveTab,
  selectedColumns,
  availableColumns,
  handleColumnToggle,
  refreshTrigger,
  recentFiles
}: ActionTabsProps) => {
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="mb-12">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-3 gap-4 bg-transparent p-0">
          <TabsTrigger 
            value="database" 
            className="data-[state=active]:bg-kpmg-blue data-[state=active]:text-white border rounded-md shadow-sm h-auto"
          >
            <div className="p-2">
              <div className="flex justify-center mb-1">
                <Database size={20} />
              </div>
              <h3 className="text-xs font-medium uppercase">View Database</h3>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="upload" 
            className="data-[state=active]:bg-kpmg-blue data-[state=active]:text-white border rounded-md shadow-sm h-auto"
          >
            <div className="p-2">
              <div className="flex justify-center mb-1">
                <Upload size={20} />
              </div>
              <h3 className="text-xs font-medium uppercase">Upload Files</h3>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="master" 
            className="data-[state=active]:bg-kpmg-blue data-[state=active]:text-white border rounded-md shadow-sm h-auto"
          >
            <div className="p-2">
              <div className="flex justify-center mb-1">
                <Settings size={20} />
              </div>
              <h3 className="text-xs font-medium uppercase">Master Table</h3>
            </div>
          </TabsTrigger>
        </TabsList>
        
        {/* Tab Content with increased top margin for spacing */}
        <TabsContent value="upload" className="mt-12">
          <FileUpload onDataSaved={() => setActiveTab("database")} />
        </TabsContent>
        
        <TabsContent value="database" className="mt-12">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-3/4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <DatabaseTable key={refreshTrigger} selectedColumns={selectedColumns} />
              </div>
            </div>
            
            <div className="w-full lg:w-1/4 space-y-6">
              {/* Column Selector */}
              <ColumnSelectorComponent 
                availableColumns={availableColumns} 
                selectedColumns={selectedColumns}
                handleColumnToggle={handleColumnToggle}
              />
              
              {/* Recent Files */}
              <RecentFiles files={recentFiles} />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="master" className="mt-12">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <h3 className="text-xl font-medium">Master Table Coming Soon</h3>
            <p className="text-gray-500 mt-2">This feature is under development.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Internal component for column selector
const ColumnSelectorComponent = ({ 
  availableColumns, 
  selectedColumns, 
  handleColumnToggle 
}: { 
  availableColumns: string[], 
  selectedColumns: string[],
  handleColumnToggle: (column: string) => void
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Table Columns</h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
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
  );
};

export default ActionTabs;
