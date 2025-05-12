
// Shared TableData interface to be used across components
export interface TableData {
  id: number;
  fileName: string;
  billDate?: string;
  totalAmount?: string;
  bankName?: string;
  swiftCode?: string;
  upiId?: string;
  uploadDateTime?: string;
  invoiceDate?: string;
  taxInvoiceNo?: string;
  gstNo?: string;
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
