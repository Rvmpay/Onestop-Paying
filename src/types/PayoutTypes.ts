// types/PayoutTypes.ts
export interface InitiatePayout {
    merchantTransactionId: string;
    amount: number;
    channel: string;
    payoutType: 'UPI' | 'IMPS';
    beneficiaryVPA?: string;
    beneficiaryAccount?: string;
    beneficiaryIFSC?: string;
    name: string;
    mobile: string;
    payoutRemark: string;
    checksum: string;
  }
  
  