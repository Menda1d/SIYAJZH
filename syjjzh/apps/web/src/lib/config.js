// Update this to your business WhatsApp number in international format (no +, no spaces).
// Example: South Africa 27, then the number without the leading 0.
export const WHATSAPP_NUMBER = "2347062022875";
export const BUSINESS_NAME = "SIYAJZH";
export const CURRENCY = "₦";

export function formatPrice(n) {
  const num = Number(n) || 0;
  return `${CURRENCY}${num.toFixed(2)}`;
}
