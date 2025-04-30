// types/BulkPayoutTypes.ts
export interface PayoutItem {
    merchantTransactionId: string;
    amount: number;
    beneficiaryAccount: string;
    beneficiaryIFSC: string;
    beneficiaryName: string;
    beneficiaryMobNo: string;
    payoutRemark: string;
    payoutMode: 'UPI' | 'IMPS';
    beneficiaryVPA?: string;
  }
  
  export interface BulkPayout {
    bulkBatchRefId: string;
    payouts: PayoutItem[];
  }
  

