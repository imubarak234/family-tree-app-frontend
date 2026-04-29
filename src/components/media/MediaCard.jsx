import { FileText, FileSpreadsheet, File, Download, Edit2, Trash2, Image } from 'lucide-react';
import { getMediaUrl, formatFileSize, formatDate } from '../../utils/formatters';

function DocIcon({ mimeType }) {
  if (mimeType === 'application/pdf') {
    return <FileText className="w-8 h-8 text-red-500" />;
  }
  if (
    mimeType === 'application/vnd.ms-excel' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ) {
    return <FileSpreadsheet className="w-8 h-8 text-green-600" />;
  }
  if (
    mimeType === 'application/msword' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return <FileText className="w-8 h-8 text-blue-600" />;
  }
  return <File className="w-8 h-8 text-gray-500" />;
}

export default function MediaCard({ item, onClick, onEdit, onDelete, canEdit, canDelete }) {
  const isPhoto = item.mediaType === 'Photo';
  const imageUrl = isPhoto ? getMediaUrl(item.filePath) : null;

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit?.(item);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete?.(item);
  };

  if (isPhoto) {
    return (
      <div
        className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
        onClick={() => onClick?.(item)}
      >
        {/* Photo thumbnail */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-blue-50 to-purple-50">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={item.title || item.originalName}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Image className="w-12 h-12 text-gray-300" />
            </div>
          )}

          {/* Hover overlay with actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-end justify-between p-3 opacity-0 group-hover:opacity-100">
            <div className="flex gap-2">
              {canEdit && (
                <button
                  onClick={handleEdit}
                  className="p-1.5 bg-white/90 rounded-lg hover:bg-white transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4 text-gray-700" />
                </button>
              )}
              {canDelete && (
                <button
                  onClick={handleDelete}
                  className="p-1.5 bg-white/90 rounded-lg hover:bg-white transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              )}
            </div>
            <span className="text-xs text-white/90 bg-black/40 px-2 py-0.5 rounded">
              {formatFileSize(item.fileSize)}
            </span>
          </div>
        </div>

        {/* Caption */}
        <div className="px-3 py-2">
          <p className="text-sm font-medium text-gray-900 truncate">
            {item.title || item.originalName}
          </p>
          <p className="text-xs text-gray-500">{formatDate(item.createdAt)}</p>
        </div>
      </div>
    );
  }

  // Document card (list style)
  return (
    <div
      className="group flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
      onClick={() => onClick?.(item)}
    >
      <div className="flex-shrink-0 p-2 bg-gray-50 rounded-lg">
        <DocIcon mimeType={item.mimeType} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {item.title || item.originalName}
        </p>
        <p className="text-xs text-gray-500 truncate">{item.originalName}</p>
        <p className="text-xs text-gray-400">
          {formatFileSize(item.fileSize)} · {formatDate(item.createdAt)}
        </p>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <a
          href={getMediaUrl(item.filePath)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          title="Download"
        >
          <Download className="w-4 h-4 text-gray-600" />
        </a>
        {canEdit && (
          <button
            onClick={handleEdit}
            className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            title="Edit"
          >
            <Edit2 className="w-4 h-4 text-gray-600" />
          </button>
        )}
        {canDelete && (
          <button
            onClick={handleDelete}
            className="p-1.5 bg-gray-100 rounded-lg hover:bg-red-100 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        )}
      </div>
    </div>
  );
}
