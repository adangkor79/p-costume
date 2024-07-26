// utils/promptpay-qr.ts
export function generatePromptPayQRCodeData(amount: number, phoneNumber: string): string {
  // Format the amount to 2 decimal places
  const formattedAmount = (amount * 100).toFixed(0);

  // PromptPay QR Code format
  const qrData = [
    '000201', // Header
    '010211', // Payload Format Indicator
    '29370016', // Merchant Account Information
    '0010', // Payload Format Indicator
    '010', // QR Code Version
    '011201', // Merchant Name
    '1234567890123456', // Merchant ID
    '012', // Transaction Type
    '0610598374', // Phone Number
    '054' + formattedAmount, // Amount
    '6304' // CRC
  ].join('');

  return qrData;
}
