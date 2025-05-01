
import { useState } from 'react';
import { File, Trash2, Edit } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import EditRowDialog from './EditRowDialog';
import AddNewRowDialog from './AddNewRowDialog';

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
}

interface DatabaseTableProps {
  selectedColumns: string[];
}

const initialData: TableData[] = [
  {
    id: 1,
    fileName: "invoice_jan.pdf",
    billDate: '14-01-2025',
    totalAmount: '11,000',
    bankName: 'The Hongkong and Shanghai Banking Corporation Ltd',
    swiftCode: 'KPMG',
    upiId: 'KPMG@HSBC',
    uploadDateTime: 'Mon, 21 Apr 2025 18:17:59 GMT',
    invoiceDate: '13-JAN-25',
    taxInvoiceNo: 'KPMG-HK/80090',
    gstNo: '06AAAFK1513H1ZV'
  },
  {
    id: 2,
    fileName: "invoice_oct.pdf",
    billDate: '01-11-2024',
    totalAmount: '9,240',
    bankName: 'The Hongkong and Shanghai Banking Corporation Ltd',
    swiftCode: 'KPMG',
    upiId: 'KPMG@HSBC',
    uploadDateTime: 'Mon, 21 Apr 2025 18:17:59 GMT',
    invoiceDate: '31-OCT-24',
    taxInvoiceNo: 'KPMG-HK/80082',
    gstNo: '06AAAFK1513H1ZV'
  },
  {
    id: 3,
    fileName: "invoice_apr.pdf",
    billDate: '12-04-2024',
    totalAmount: '284,162',
    bankName: 'The Hongkong and Shanghai Banking Corporation Ltd',
    swiftCode: 'KPMG',
    upiId: 'KPMG@HSBC',
    uploadDateTime: 'Mon, 21 Apr 2025 18:17:59 GMT',
    invoiceDate: '12-APR-24',
    taxInvoiceNo: 'KPMG-HK/80003',
    gstNo: '06AAAFK1513H1ZV'
  }
];

const DatabaseTable: React.FC<DatabaseTableProps> = ({ selectedColumns }) => {
  const [data, setData] = useState<TableData[]>(initialData);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [editingRow, setEditingRow] = useState<TableData | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  // Map friendly display names to actual data keys
  const columnMap: Record<string, keyof TableData> = {
    'ID': 'id',
    'File Name': 'fileName',
    'Bill Date': 'billDate',
    'Total Amount': 'totalAmount',
    'Bank Name': 'bankName',
    'Swift Code': 'swiftCode',
    'UPI ID': 'upiId',
    'Upload Date Time': 'uploadDateTime',
    'Invoice Date': 'invoiceDate',
    'Tax Invoice No': 'taxInvoiceNo',
    'GST No': 'gstNo'
  };

  const displayColumns = selectedColumns.map(col => {
    // Replace 'Page No.' with 'File Name'
    if (col === 'Page No.') {
      return {
        name: 'File Name',
        key: 'fileName'
      };
    }
    
    // For all other columns
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

  return (
    <div className="table-container mt-6">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={handleDeleteSelected}
          disabled={selectedRows.length === 0}
          className="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50"
        >
          <Trash2 size={18} />
          <span>Delete Selected</span>
        </button>
        
        <button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-kpmg-purple text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <span>Add New</span>
        </button>
      </div>

      <table className="data-table">
        <thead className="data-table-header">
          <tr>
            <th className="data-table-cell text-left w-10">
              <Checkbox 
                checked={selectedRows.length === data.length && data.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </th>
            {displayColumns.map((column, index) => (
              <th key={index} className="data-table-cell text-left">
                {column.name}
              </th>
            ))}
            <th className="data-table-cell text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr 
              key={row.id} 
              className={rowIndex % 2 === 0 ? "data-table-row-purple" : "data-table-row"}
            >
              <td className="data-table-cell">
                <Checkbox 
                  checked={selectedRows.includes(row.id)}
                  onCheckedChange={() => handleRowSelect(row.id)}
                />
              </td>
              {displayColumns.map((column, colIndex) => (
                <td key={`${row.id}-${colIndex}`} className="data-table-cell">
                  {row[column.key as keyof TableData]}
                </td>
              ))}
              <td className="data-table-cell">
                <button 
                  onClick={() => handleEditRow(row)}
                  className="p-1 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <Edit size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="flex justify-end mt-4">
        <button className="bg-white border border-gray-300 text-kpmg-purple px-4 py-2 rounded flex items-center gap-2">
          <File size={18} />
          <span>Open File</span>
        </button>
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
