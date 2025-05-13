
import { useState, useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EditRowDialog from './EditRowDialog';
import AddNewRowDialog from './AddNewRowDialog';
import { TableData } from '@/types/database';

interface DatabaseTableProps {
  selectedColumns: string[];
}

const DatabaseTable: React.FC<DatabaseTableProps> = ({ selectedColumns }) => {
  const [data, setData] = useState<TableData[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [editingRow, setEditingRow] = useState<TableData | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  
  // Define backend URL that works both in development and when deployed
  const BACKEND_URL = import.meta.env.PROD 
    ? (window.location.protocol + '//' + window.location.hostname + ':5000') // Use same host with port 5000
    : 'http://localhost:5000'; // Default for development

  // Enhanced column map to include backend fields
  const columnMap: Record<string, keyof TableData> = {
    'id': 'id',
    'fileName': 'fileName',
    'billDate': 'billDate',
    'totalAmount': 'totalAmount',
    'bankName': 'bankName',
    'swiftCode': 'swiftCode',
    'upiId': 'upiId',
    'uploadDateTime': 'uploadDateTime',
    'invoiceDate': 'invoiceDate',
    'taxInvoiceNo': 'taxInvoiceNo',
    'gstNo': 'gstNo',
    // Backend fields
    'Stand No': 'Stand_No',
    'Street No': 'Street_No',
    'Stand valuation': 'Stand_valuation',
    'ACC No': 'ACC_No',
    'Route No': 'Route_No',
    'Deposit': 'Deposit',
    'Guarantee': 'Guarantee',
    'Acc Date': 'Acc_Date',
    'Improvements': 'Improvements',
    'Payments up to': 'Payments_up_to',
    'VAT Reg No': 'VAT_Reg_No',
    'Balance B/F': 'Balance_B_F',
    'Payments': 'Payments',
    'Sub total': 'Sub_total',
    'Month total': 'Month_total',
    'Total due': 'Total_due',
    'Over 90': 'Over_90',
    '90 days': 'Ninety_days',
    '60 days': 'Sixty_days',
    '30 days': 'Thirty_days',
    'Current': 'Current',
    'Due Date': 'Due_Date'
  };

  const displayColumns = selectedColumns.map(col => {
    return {
      name: col,
      key: columnMap[col] || col.toLowerCase().replace(/\s/g, '')
    };
  });

  // Fetch data from backend when component mounts
  useEffect(() => {
    fetchDataFromBackend();
  }, []);

  const handleRowSelect = (id: number) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id) 
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data.map(row => row.id));
    }
  };

  // Updated function to delete rows permanently from the database
  const handleDeleteSelected = async () => {
    if (selectedRows.length === 0) {
      toast({
        title: "Info",
        description: "No rows selected for deletion",
      });
      return;
    }
    
    setIsDeleting(true);
    
    try {
      // Get the ACC_No values for the selected rows to delete from database
      const selectedAccountNumbers = selectedRows.map(rowId => {
        const row = data.find(item => item.id === rowId);
        return row?.ACC_No;
      }).filter(Boolean); // Remove undefined values
      
      console.log("Account numbers to delete:", selectedAccountNumbers);
      
      // Send delete request to the backend
      const response = await fetch(`${BACKEND_URL}/delete-bills`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accountNumbers: selectedAccountNumbers }),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to delete from database');
      }
      
      console.log("Delete response:", responseData);
      
      // If successful, update UI
      const updatedData = data.filter(row => !selectedRows.includes(row.id));
      
      // Reassign IDs to be sequential
      const reindexedData = updatedData.map((row, index) => ({
        ...row,
        id: index + 1
      }));
      
      setData(reindexedData);
      setSelectedRows([]);
      
      toast({
        description: `${selectedRows.length} row(s) deleted successfully`,
      });
      
    } catch (error) {
      console.error('Error deleting rows:', error);
      toast({
        title: "Error",
        description: error instanceof Error 
          ? error.message 
          : "Failed to delete rows from database",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditRow = (row: TableData) => {
    setEditingRow(row);
  };

  const handleSaveEdit = (updatedRow: TableData) => {
    const updatedData = data.map(row => 
      row.id === updatedRow.id ? updatedRow : row
    );
    
    setData(updatedData);
    setEditingRow(null);
    
    toast({
      description: "Row updated successfully",
    });
  };

  const handleAddNewRow = (newRow: Omit<TableData, 'id'>) => {
    const newId = data.length > 0 ? Math.max(...data.map(row => row.id)) + 1 : 1;
    
    const rowWithId = {
      ...newRow,
      id: newId
    };
    
    setData([...data, rowWithId]);
    setIsAddDialogOpen(false);
    
    toast({
      description: "New row added successfully",
    });
  };

  // Updated function to fetch data from backend with better error handling
  const fetchDataFromBackend = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching data from:", `${BACKEND_URL}/get-all-bills`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch(`${BACKEND_URL}/get-all-bills`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || "Failed to load data");
      }
      
      // Convert backend data format to TableData format
      // Ensure proper field name formatting from snake_case to camelCase for display
      if (result.data && Array.isArray(result.data)) {
        const formattedData = result.data.map((item: any, index: number) => {
          // Format the data to match the TableData interface
          const formattedItem: TableData = {
            id: index + 1,
            fileName: `Bill_${item.ACC_No || index}.pdf`,
            // Map the database fields directly to our TableData interface
            ACC_No: item.ACC_No,
            Stand_No: item.Stand_No,
            Street_No: item.Street_No,
            Stand_valuation: item.Stand_valuation,
            Route_No: item.Route_No,
            Deposit: item.Deposit,
            Guarantee: item.Guarantee,
            Acc_Date: item.Acc_Date,
            Improvements: item.Improvements,
            Payments_up_to: item.Payments_up_to,
            VAT_Reg_No: item.VAT_Reg_No,
            Balance_B_F: item.Balance_B_F,
            Payments: item.Payments,
            Sub_total: item.Sub_total,
            Month_total: item.Month_total,
            Total_due: item.Total_due,
            Over_90: item.Over_90,
            Ninety_days: item.Ninety_days,
            Sixty_days: item.Sixty_days,
            Thirty_days: item.Thirty_days,
            Current: item.Current,
            Due_Date: item.Due_Date
          };
          
          return formattedItem;
        });
        
        console.log("Formatted data:", formattedData);
        setData(formattedData);
        
        if (formattedData.length > 0) {
          toast({
            description: `${formattedData.length} records loaded from database`,
          });
        } else {
          toast({
            description: "No records found in database",
          });
        }
      } else {
        console.error("Invalid data format received:", result);
        toast({
          title: "Error",
          description: "The data received from the server is not in the expected format.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: error instanceof Error 
          ? error.message 
          : "Failed to load data from database. Make sure the backend is running.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Database Preview</h2>
        <div className="flex gap-4">
          <button 
            onClick={handleDeleteSelected}
            disabled={selectedRows.length === 0 || isDeleting}
            className="bg-[#ea384c] text-white px-3 py-2 rounded flex items-center gap-2 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.83 6.72 2.24"></path>
                  <path d="M21 3v9h-9"></path>
                </svg>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Delete All
              </>
            )}
          </button>
          
          <button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-white text-kpmg-blue border border-kpmg-blue px-3 py-2 rounded flex items-center gap-2 hover:bg-gray-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add New
          </button>
          
          <button 
            onClick={fetchDataFromBackend}
            disabled={isLoading}
            className="bg-kpmg-blue text-white px-3 py-2 rounded flex items-center gap-2 hover:bg-kpmg-blue/90 disabled:opacity-70"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isLoading ? "animate-spin" : ""}>
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.83 6.72 2.24"></path>
              <path d="M21 3v9h-9"></path>
            </svg>
            {isLoading ? "Loading..." : "Refresh Data"}
          </button>
        </div>
      </div>
      
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-kpmg-blue text-white">
              <TableRow>
                <TableHead className="w-10 text-white">
                  <Checkbox 
                    checked={selectedRows.length === data.length && data.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="text-white w-20">Actions</TableHead>
                {displayColumns.map((column) => (
                  <TableHead key={column.key} className="text-white whitespace-nowrap">
                    {column.name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={displayColumns.length + 2} className="text-center py-4">
                    {isLoading ? "Loading data..." : "No data available"}
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row) => (
                  <TableRow key={row.id} className="hover:bg-gray-50">
                    <TableCell>
                      <Checkbox 
                        checked={selectedRows.includes(row.id)}
                        onCheckedChange={() => handleRowSelect(row.id)}
                      />
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <button 
                        onClick={() => handleEditRow(row)}
                        className="p-1 rounded-md hover:bg-gray-200 transition-colors"
                        title="Edit row"
                      >
                        <Edit size={16} />
                      </button>
                    </TableCell>
                    {displayColumns.map((column) => (
                      <TableCell key={`${row.id}-${column.key}`} className="whitespace-nowrap">
                        {row[column.key as keyof TableData]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {editingRow && (
        <EditRowDialog
          open={!!editingRow}
          onOpenChange={() => setEditingRow(null)}
          row={editingRow}
          onSave={handleSaveEdit}
        />
      )}

      <AddNewRowDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={handleAddNewRow}
      />
    </div>
  );
};

export default DatabaseTable;
