export function generateOrderCode(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const random = Math.floor(100 + Math.random() * 900); // angka 100-999

  return `AR-${yy}${mm}${dd}-${random}`;
}

export const BUSINESS_WHATSAPP_NUMBER = "6288216244145"; 