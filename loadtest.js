import http from 'k6/http';
import { check, sleep } from 'k6';
import { hmac } from 'k6/crypto';
import encoding from 'k6/encoding';




const BASE_URL = 'http://localhost:3000/api/v1';  // change to your API URL

const merchantId = 'your-merchant-id';
const merchantKey = 'your-merchant-key';

// Dummy checksum generator (replace with your real logic)

function generateChecksum(dataString, merchantKey) {
    const keyBytes = encoding.encode(merchantKey, 'utf-8');
    const msgBytes = encoding.encode(dataString, 'utf-8');
    const hashBytes = hmac('sha256', msgBytes, keyBytes);
    return encoding.hexEncode(hashBytes);
  }

// Data generators for each API

function getUpiInitiateBody(merchantId, merchantKey) {
    const merchantTransactionId = 'TXN' + Math.floor(Math.random() * 1e8);
    const amount = +(Math.random() * 1000).toFixed(2);
    const name = 'John Doe';
    const mobile = '9999999999';
    const channel = 'APP';
  
    const dataString = `${merchantId}|${merchantTransactionId}|${amount}|${channel}|${name}|${mobile}`;
    const checksum = generateChecksum(dataString, merchantKey);
  
    return {
      merchantTransactionId,
      amount,
      name,
      mobile,
      channel,
      checksum,
    };
  }
  

function getSinglePayoutBody() {
  const merchantTransactionId = 'TXN' + Math.floor(Math.random() * 1e8);
  const amount = (Math.random() * 1000).toFixed(2);
  const channel = 'APP';
  const payoutType = 'IMPS';
  const name = 'John Doe';
  const mobile = '9999999999';
  const payoutRemark = 'Test payout';
  const beneficiaryAccount = '1234567890';
  const beneficiaryIFSC = 'SBIN0000001';
  const beneficiaryVPA = '';
  const dataString = `${merchantTransactionId}|${amount}|${channel}|${payoutType}|${name}|${mobile}`;
  const checksum = generateChecksum(dataString, merchantKey);

  return {
    merchantTransactionId,
    amount: Number(amount),
    channel,
    payoutType,
    beneficiaryVPA,
    beneficiaryAccount,
    beneficiaryIFSC,
    name,
    mobile,
    payoutRemark,
    checksum,
  };
}

function getBulkPayoutBody() {
  const bulkBatchRefId = 'BATCH' + Math.floor(Math.random() * 1e8);
  const payouts = [];

  for (let i = 0; i < 5; i++) {
    const merchantTransactionId = 'TXN' + Math.floor(Math.random() * 1e8);
    const amount = (Math.random() * 1000).toFixed(2);
    const beneficiaryAccount = '1234567890' + i;
    const beneficiaryIFSC = 'SBIN0000001';
    const name = 'John Doe ' + i;
    const mobile = '999999999' + i;
    const payoutRemark = 'Bulk payout test ' + i;
    const payoutMode = 'IMPS';
    const beneficiaryVPA = '';

    payouts.push({
      merchantTransactionId,
      amount: Number(amount),
      beneficiaryAccount,
      beneficiaryIFSC,
      name,
      mobile,
      payoutRemark,
      payoutMode,
      beneficiaryVPA,
    });
  }

  return {
    bulkBatchRefId,
    payouts,
  };
}

function checkTxnStatus() {
  const merchantTransactionId = 'TXN' + Math.floor(Math.random() * 1e8);
  const checksum = generateChecksum(merchantTransactionId, merchantKey);

  return {
    merchantTransactionId,
    checksum,
  };
}

// k6 options
export const options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  // Round robin or random to pick API
  const choice = Math.floor(Math.random() * 4);

  let url = '';
  let payload = '';
  let headers = {
    'Content-Type': 'application/json',
    'X-MERCHANT-ID': merchantId,
    'X-MERCHANT-KEY': merchantKey,
  };

  switch (choice) {
    case 0:
      url = `${BASE_URL}/pg/upi/initiate`;
      payload = JSON.stringify(getUpiInitiateBody());
      break;
    case 1:
      url = `${BASE_URL}/payout/initiatePayout`;
      payload = JSON.stringify(getSinglePayoutBody());
      break;
    case 2:
      url = `${BASE_URL}/payout/initiateBulkPayout`;
      payload = JSON.stringify(getBulkPayoutBody());
      break;
    case 3:
      url = `${BASE_URL}/pg/checkTxnStatus`;
      payload = JSON.stringify(checkTxnStatus());
      break;
  }

  const res = http.post(url, payload, { headers });

  check(res, {
    'status is 200 or 400 or 401': (r) => [200, 400, 401].includes(r.status),
  });

  sleep(1);
}

