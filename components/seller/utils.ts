export const allColumns = [
  { key: "saleId", label: "Sale ID", mandatory: true },
  { key: "productTitle", label: "Product Title", mandatory: true },
  { key: "quantity", label: "Quantity", mandatory: true },
  { key: "amount", label: "Amount", mandatory: true },
  { key: "purchaseDate", label: "Purchase Date", mandatory: true },
  { key: "status", label: "Status", mandatory: true },
  { key: "orderDate", label: "Order Date", mandatory: true },
  { key: "shippingMethod", label: "Shipping Method", mandatory: true },
  { key: "paymentMethod", label: "Payment Method", mandatory: true },
  { key: "total", label: "Total", mandatory: true },
  { key: "buyerEmail", label: "Buyer Email", mandatory: false },
  { key: "returnDeadline", label: "Return Deadline", mandatory: false },
  { key: "isReturnable", label: "Is Returnable", mandatory: false },
  { key: "shippingCost", label: "Shipping Cost", mandatory: false },
  { key: "discount", label: "Discount", mandatory: false },
  { key: "tax", label: "Tax", mandatory: false },
];

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}
