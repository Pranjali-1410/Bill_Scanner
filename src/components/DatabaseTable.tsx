
import { useState } from 'react';
import { File } from 'lucide-react';

interface TableData {
  id: number;
  pageNo: number;
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

const generateMockData = (): TableData[] => {
  return [
    {
      id: 1,
      pageNo: 1,
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
      id: 38,
      pageNo: 2,
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
      id: 39,
      pageNo: 3,
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
};

const DatabaseTable: React.FC<DatabaseTableProps> = ({ selectedColumns }) => {
  const [data] = useState<TableData[]>(generateMockData());

  // Map friendly display names to actual data keys
  const columnMap: Record<string, keyof TableData> = {
    'ID': 'id',
    'Page No.': 'pageNo',
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

  const displayColumns = selectedColumns.map(col => ({
    name: col,
    key: columnMap[col] || col.toLowerCase().replace(/\s/g, '')
  }));

  return (
    <div className="table-container mt-6">
      <table className="data-table">
        <thead className="data-table-header">
          <tr>
            {displayColumns.map((column, index) => (
              <th key={index} className="data-table-cell text-left">
                {column.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr 
              key={row.id} 
              className={rowIndex % 2 === 0 ? "data-table-row-purple" : "data-table-row"}
            >
              {displayColumns.map((column, colIndex) => (
                <td key={`${row.id}-${colIndex}`} className="data-table-cell">
                  {row[column.key as keyof TableData]}
                </td>
              ))}
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
    </div>
  );
};

export default DatabaseTable;
