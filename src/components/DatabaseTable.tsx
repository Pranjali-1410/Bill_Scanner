import { useState } from 'react';
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

// Expanded TableData to match possible backend fields
interface TableData {
  id: number;
  fileName: string;
  billDate: string;
  totalAmount: string;
  bankName: string;
  swiftCode: string;
  upiId: string;
  uploadDateTime: string;
  invoiceDate: string;
  taxInvoiceNo: string;
  gstNo: string;
  // Fields from Python backend
  Stand_No?: string;
  Street_No?: string;
  Stand_valuation?: string;
  ACC_No?: string;
  Route_No?: string;
  Deposit?: string;
  Guarantee?: string;
  Acc_Date?: string;
  Improvements?: string;
  Payments_up_to?: string;
  VAT_Reg_No?: string;
  Balance_B_F?: string;
  Payments?: string;
  Sub_total?: string;
  Month_total?: string;
  Total_due?: string;
  Over_90?: string;
  Ninety_days?: string;
  Sixty_days?: string;
  Thirty_days?: string;
  Current?: string;
  Due_Date?: string;
}

interface DatabaseTableProps {
  selectedColumns: string[];
}

const initialData: TableData[] = [
  {
    id: 1,
    fileName: "Invoice_KPMG_001.pdf",
    billDate: '14-07-2025',
    totalAmount: '11,000',
    bankName: 'The Hongkong and Shanghai Banking Corporation Ltd',
    swiftCode: 'KPMG',
    upiId: 'KPMG@HSBC',
    uploadDateTime: 'Mon, 21 Apr 2025 18:17:50 GMT',
    invoiceDate: '13-JAN-25',
    taxInvoiceNo: 'KPMG-HR/007090',
    gstNo: '06AAAFK1513H1ZV'
  },
  {
    id: 2,
    fileName: "Invoice_KPMG_002.pdf",
    billDate: '01-11-2024',
    totalAmount: '9,240',
    bankName: 'The Hongkong and Shanghai Banking Corporation Ltd',
    swiftCode: 'KPMG',
    upiId: 'KPMG@HSBC',
    uploadDateTime: 'Mon, 21 Apr 2025 18:17:50 GMT',
    invoiceDate: '31-OCT-24',
    taxInvoiceNo: 'KPMG-HR/000082',
    gstNo: '06AAAFK1513H1ZV'
  },
  {
    id: 3,
    fileName: "Invoice_KPMG_003.pdf",
    billDate: '12-04-2024',
    totalAmount: '284,162',
    bankName: 'The Hongkong and Shanghai Banking Corporation Ltd',
    swiftCode: 'KPMG',
    upiId: 'KPMG@HSBC',
    uploadDateTime: 'Mon, 21 Apr 2025 18:17:50 GMT',
    invoiceDate: '12-APR-24',
    taxInvoiceNo: 'KPMG-HR/000003',
    gstNo: '06AAAFK1513H1ZV'
  }
];

const DatabaseTable: React.FC<DatabaseTableProps> = ({ selectedColumns }) => {
  const [data, setData] = useState<TableData[]>(initialData);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [editingRow, setEditingRow] = useState<TableData | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

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

  const handleDeleteSelected = () => {
    if (selectedRows.length === 0) {
      toast({
        title: "Info",
        description: "No rows selected for deletion",
      });
      return;
    }
    
    // Filter out selected rows
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

  // Add function to fetch data from backend (to be implemented)
  const fetchDataFromBackend = async () => {
    try {
      const response = await fetch('http://localhost:5000/get-all-bills'); // This endpoint would need to be added to your Python backend
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      const fetchedData = await response.json();
      
      // Convert backend data format to TableData format
      const formattedData = fetchedData.map((item: any, index: number) => ({
        id: index + 1,
        fileName: `Bill_${item.ACC_No || index}.pdf`,
        ...item
      }));
      
      setData(formattedData);
      toast({
        description: "Data loaded from database",
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load data from database",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Database Preview</h2>
        <div className="flex gap-4">
          <button 
            onClick={handleDeleteSelected}
            disabled={selectedRows.length === 0}
            className="bg-[#ea384c] text-white px-3 py-2 rounded flex items-center gap-2 disabled:opacity-50"
          >
            <Trash2 size={16} />
            Delete All
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
            className="bg-kpmg-blue text-white px-3 py-2 rounded flex items-center gap-2 hover:bg-kpmg-blue/90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.83 6.72 2.24"></path>
              <path d="M21 3v9h-9"></path>
            </svg>
            Refresh Data
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
                    No data available
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
