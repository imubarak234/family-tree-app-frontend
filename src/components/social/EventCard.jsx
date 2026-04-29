import { CalendarDays, MapPin, Pencil, Trash2, Eye } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export default function EventCard({ item, onOpen, onEdit, onDelete, canEdit, canDelete }) {
  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">{item.description}</p>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="w-3.5 h-3.5" />
              {formatDate(item.startsAt)}
            </span>
            {item.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {item.location}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => onOpen?.(item)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg" title="Open">
            <Eye className="w-4 h-4" />
          </button>
          {canEdit && (
            <button type="button" onClick={() => onEdit?.(item)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg" title="Edit">
              <Pencil className="w-4 h-4" />
            </button>
          )}
          {canDelete && (
            <button type="button" onClick={() => onDelete?.(item)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg" title="Delete">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
