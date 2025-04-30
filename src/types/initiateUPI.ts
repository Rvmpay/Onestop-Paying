export interface InitiateUPIRequestBody {
    merchantTransactionId: string;
    amount: number;
    name: string;
    mobile: string;
    channel: string;
    checksum: string;
  }
  
  
  
  export interface CheckTxnStatusRequestBody {
    merchantTransactionId: string;
  }