import { useNavigate } from 'react-router-dom';
import { Camera, ChevronRight, Image } from 'lucide-react';
import { useMedia } from '../../hooks/useMedia';
import { getMediaUrl } from '../../utils/formatters';
import LoadingSpinner from '../common/LoadingSpinner';

export default function PhotoGalleryWidget() {
  const navigate = useNavigate();
  const { data, loading, error } = useMedia({ mediaType: 'Photo', limit: 6, page: 1 });
  const items = data?.items || [];

  return (
    <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6 h-full">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base sm:text-lg font-semibold tracking-tight text-gray-900 inline-flex items-center gap-2">
          <Camera className="w-5 h-5 text-blue-600" />
          Gallery Photos
        </h3>
        <button
          onClick={() => navigate('/media/photos')}
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
        <div className="py-8 text-center text-sm text-gray-500">
          No photos yet. Upload family moments to see them here.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {items.slice(0, 6).map((item) => {
            const url = getMediaUrl(item.filePath);
            return (
              <button
                key={item.id}
                onClick={() => navigate('/media/photos')}
                className="relative aspect-square rounded-lg overflow-hidden border border-gray-100 bg-gray-50 group transition-all hover:-translate-y-0.5 hover:shadow-sm"
                title={item.title || item.originalName || 'Photo'}
              >
                {url ? (
                  <img
                    src={url}
                    alt={item.title || item.originalName || 'Family photo'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                    <Image className="w-6 h-6 text-blue-300" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
