import { formatDate } from './formatters.js';
import { formatKoboToCurrency } from './billing.js';

export function buildInvoicePdfHtml(invoice) {
  const itemsHtml = (invoice.items || [])
    .map(
      (item) => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${item.description || '-'}</td>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:right;">${item.quantity || 0}</td>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:right;">${formatKoboToCurrency(item.unitAmountKobo, invoice.currency)}</td>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:right;">${formatKoboToCurrency(item.totalKobo, invoice.currency)}</td>
        </tr>
      `,
    )
    .join('');

  return `
  <html>
    <head>
      <title>Invoice ${invoice.invoiceNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; color: #111827; margin: 24px; }
        h1,h2,h3,p { margin: 0 0 8px; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 16px; }
        .muted { color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <h1>Invoice ${invoice.invoiceNumber}</h1>
      <p class="muted">Status: ${invoice.status || 'unknown'}</p>
      <div class="grid">
        <div>
          <p><strong>Due date:</strong> ${formatDate(invoice.dueAt)}</p>
          <p><strong>Paid at:</strong> ${invoice.paidAt ? formatDate(invoice.paidAt) : 'Not paid'}</p>
        </div>
        <div>
          <p><strong>Subtotal:</strong> ${formatKoboToCurrency(invoice.subtotalKobo, invoice.currency)}</p>
          <p><strong>Total:</strong> ${formatKoboToCurrency(invoice.totalKobo, invoice.currency)}</p>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th style="text-align:left;padding:8px;border-bottom:2px solid #d1d5db;">Description</th>
            <th style="text-align:right;padding:8px;border-bottom:2px solid #d1d5db;">Qty</th>
            <th style="text-align:right;padding:8px;border-bottom:2px solid #d1d5db;">Unit</th>
            <th style="text-align:right;padding:8px;border-bottom:2px solid #d1d5db;">Line Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
    </body>
  </html>`;
}

export async function downloadInvoicePdf(invoice) {
  const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=900,height=800');
  if (!printWindow) {
    throw new Error('Popup blocked. Please allow popups to download PDF.');
  }

  const html = buildInvoicePdfHtml(invoice);
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  await new Promise((resolve) => {
    printWindow.onload = resolve;
    setTimeout(resolve, 400);
  });

  printWindow.focus();
  printWindow.print();
}
