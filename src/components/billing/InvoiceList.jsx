import { formatDate } from '../../utils/formatters';
import { formatKoboToCurrency, getInvoiceStatusMeta } from '../../utils/billing';

export default function InvoiceList({
  invoices,
  pagination,
  loading,
  error,
  onPageChange,
  onSelectInvoice,
  selectedInvoiceId,
}) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Invoices</h2>
        <p className="text-xs text-gray-500">Page {pagination.page} of {pagination.pages || 1}</p>
      </div>

      {loading ? (
        <p className="text-sm text-gray-600">Loading billing details...</p>
      ) : error ? (
        <p className="text-sm text-red-700">{error}</p>
      ) : invoices.length === 0 ? (
        <p className="text-sm text-gray-600">No invoices found.</p>
      ) : (
        <div className="space-y-2">
          {invoices.map((invoice) => {
            const status = getInvoiceStatusMeta(invoice.status);
            const isActive = selectedInvoiceId === invoice.id;

            return (
              <button
                type="button"
                key={invoice.id}
                onClick={() => onSelectInvoice(invoice.id)}
                className={`w-full text-left rounded-lg border p-3 transition-colors ${isActive ? 'border-blue-300 bg-blue-50/40' : 'border-gray-200 hover:bg-gray-50'}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</p>
                    <p className="text-xs text-gray-500">Due {formatDate(invoice.dueAt)}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${status.className}`}>
                      {status.label}
                    </span>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {formatKoboToCurrency(invoice.totalKobo, invoice.currency)}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, pagination.page - 1))}
          disabled={pagination.page <= 1}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(pagination.pages || 1, pagination.page + 1))}
          disabled={pagination.page >= (pagination.pages || 1)}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </section>
  );
}
