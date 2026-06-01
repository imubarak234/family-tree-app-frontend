import { useState } from 'react';
import { formatDate } from '../../utils/formatters';
import { canDownloadInvoicePdf, formatKoboToCurrency } from '../../utils/billing';
import { downloadInvoicePdf } from '../../utils/invoicePdf';

export default function InvoiceDetailCard({ invoice, loading, error }) {
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState('');

  const downloadable = canDownloadInvoicePdf(invoice);

  const handleDownloadPdf = async () => {
    if (!invoice || !downloadable) return;

    try {
      setPdfError('');
      setPdfLoading(true);
      await downloadInvoicePdf(invoice);
    } catch (err) {
      setPdfError(err.message || 'Unable to generate invoice PDF.');
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Invoice Detail</h2>
        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={!downloadable || pdfLoading}
          className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {pdfLoading ? 'Preparing invoice PDF...' : 'Download PDF'}
        </button>
      </div>

      {!downloadable && (
        <p className="text-xs text-amber-700 mb-3">
          PDF download is disabled because invoice details are incomplete.
        </p>
      )}

      {pdfError && (
        <p className="text-xs text-red-700 mb-3">{pdfError}</p>
      )}

      {loading ? (
        <p className="text-sm text-gray-600">Loading billing details...</p>
      ) : error ? (
        <p className="text-sm text-red-700">{error}</p>
      ) : !invoice ? (
        <p className="text-sm text-gray-600">Select an invoice to view details.</p>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-500">Invoice Number</p>
              <p className="font-medium text-gray-900">{invoice.invoiceNumber}</p>
            </div>
            <div>
              <p className="text-gray-500">Due Date</p>
              <p className="font-medium text-gray-900">{formatDate(invoice.dueAt)}</p>
            </div>
            <div>
              <p className="text-gray-500">Subtotal</p>
              <p className="font-medium text-gray-900">{formatKoboToCurrency(invoice.subtotalKobo, invoice.currency)}</p>
            </div>
            <div>
              <p className="text-gray-500">Total</p>
              <p className="font-medium text-gray-900">{formatKoboToCurrency(invoice.totalKobo, invoice.currency)}</p>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-900">Line Items</h3>
            <ul className="mt-2 space-y-2">
              {(invoice.items || []).map((item) => (
                <li key={item.id} className="text-sm border border-gray-100 rounded-lg p-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-gray-900">{item.description}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-gray-900">{formatKoboToCurrency(item.totalKobo, invoice.currency)}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
