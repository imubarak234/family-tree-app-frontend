import { Pin, Eye, Pencil, Trash2 } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export default function NewsCard({
  item,
  onOpen,
  onEdit,
  onDelete,
  onTogglePin,
  onTogglePublish,
  canEdit,
  canDelete,
  canPin,
  canPublish,
}) {
  const isPublished = item.status === 'Published';
  const isPinned = !!item.isPinned;

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs px-2 py-1 rounded-full ${
              isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {item.status || 'Draft'}
            </span>
            {isPinned && (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                <Pin className="w-3 h-3" />
                Pinned
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
          {item.excerpt && <p className="mt-2 text-sm text-gray-600 line-clamp-2">{item.excerpt}</p>}
          <p className="mt-2 text-xs text-gray-400">{formatDate(item.createdAt)}</p>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onOpen?.(item)}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            title="Open"
          >
            <Eye className="w-4 h-4" />
          </button>
          {canPin && (
            <button
              type="button"
              onClick={() => onTogglePin?.(item)}
              className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg"
              title={isPinned ? 'Unpin' : 'Pin'}
            >
              <Pin className="w-4 h-4" />
            </button>
          )}
          {canPublish && (
            <button
              type="button"
              onClick={() => onTogglePublish?.(item)}
              className="px-2 py-1 text-xs rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100"
              title={isPublished ? 'Unpublish' : 'Publish'}
            >
              {isPublished ? 'Unpublish' : 'Publish'}
            </button>
          )}
          {canEdit && (
            <button
              type="button"
              onClick={() => onEdit?.(item)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
              title="Edit"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}
          {canDelete && (
            <button
              type="button"
              onClick={() => onDelete?.(item)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
