import { createHmac } from 'crypto';

function generateChecksum(dataString: string, merchantKey: string): string {
  return createHmac('sha256', merchantKey).update(dataString).digest('hex');
}

export default generateChecksum;