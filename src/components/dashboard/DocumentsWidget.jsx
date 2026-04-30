import { useNavigate } from 'react-router-dom';
import { ChevronRight, File, FileSpreadsheet, FileText } from 'lucide-react';
import { useMedia } from '../../hooks/useMedia';
import { formatDate, formatFileSize } from '../../utils/formatters';
import LoadingSpinner from '../common/LoadingSpinner';

function getDocIcon(mimeType) {
  if (mimeType === 'application/pdf') {
    return <FileText className="w-5 h-5 text-red-500" />;
  }

  if (
    mimeType === 'application/vnd.ms-excel' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ) {
    return <FileSpreadsheet className="w-5 h-5 text-green-600" />;
  }

  if (
    mimeType === 'application/msword' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return <FileText className="w-5 h-5 text-blue-600" />;
  }

  return <File className="w-5 h-5 text-gray-500" />;
}

export default function DocumentsWidget() {
  const navigate = useNavigate();
  const { data, loading, error } = useMedia({ mediaType: 'Document', limit: 4, page: 1 });
  const items = data?.items || [];

  return (
    <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6 h-full">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base sm:text-lg font-semibold tracking-tight text-gray-900 inline-flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          Recent Documents
        </h3>
        <button
          onClick={() => navigate('/media/documents')}
          className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="py-8 flex justify-center">
          <LoadingSpinner size="md" />
        </div>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : items.length === 0 ? (
        <div className="py-8 text-center text-sm text-gray-500">No documents yet.</div>
      ) : (
        <div className="space-y-2.5">
          {items.slice(0, 4).map((doc) => (
            <button
              key={doc.id}
              onClick={() => navigate('/media/documents')}
              className="w-full text-left p-3 rounded-lg border border-gray-100 transition-all hover:-translate-y-0.5 hover:shadow-sm hover:bg-gray-50"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-start gap-2 min-w-0">
                  <div className="mt-0.5">{getDocIcon(doc.mimeType)}</div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {doc.title || doc.originalName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(doc.createdAt)}
                    </p>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md shrink-0">
                  {formatFileSize(doc.fileSize)}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
