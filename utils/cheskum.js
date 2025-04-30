import { createHmac } from 'crypto';

function generateChecksum(dataString, merchantKey) {
  return createHmac('sha256', merchantKey).update(dataString).digest('hex');
}

export default generateChecksum
