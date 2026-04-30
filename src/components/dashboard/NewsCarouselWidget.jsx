import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Newspaper, Pin } from 'lucide-react';
import { useNews } from '../../hooks/social/useNews';
import { formatDate } from '../../utils/formatters';
import LoadingSpinner from '../common/LoadingSpinner';

const AUTO_PLAY_MS = 4000;

export default function NewsCarouselWidget() {
  const navigate = useNavigate();
  const { data, loading, error } = useNews({ status: 'Published', limit: 5, page: 1 });
  const items = useMemo(() => data?.items || [], [data]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (items.length <= 1 || isPaused) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, AUTO_PLAY_MS);

    return () => window.clearInterval(timer);
  }, [items.length, isPaused]);

  const normalizedIndex = items.length > 0 ? activeIndex % items.length : 0;
  const current = items[normalizedIndex];

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  return (
    <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6 h-full">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base sm:text-lg font-semibold tracking-tight text-gray-900 inline-flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-blue-600" />
          Recent News
        </h3>
        <button
          onClick={() => navigate('/news')}
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
        <div className="py-8 text-center text-sm text-gray-500">No published news yet.</div>
      ) : (
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <button
            onClick={() => navigate(`/news/${current.id}`)}
            className="w-full text-left rounded-xl border border-gray-100 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 transition-all hover:-translate-y-0.5 hover:shadow-sm hover:from-blue-100 hover:to-indigo-100"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs px-2 py-1 rounded-full ${
                current.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {current.status || 'Draft'}
              </span>
              {current.isPinned && (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                  <Pin className="w-3 h-3" />
                  Pinned
                </span>
              )}
            </div>

            <h4 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
              {current.title}
            </h4>
            <p className="text-sm text-gray-600 line-clamp-3 min-h-[60px]">
              {current.excerpt || current.content || 'No summary available.'}
            </p>
            <p className="mt-3 text-xs text-gray-500">{formatDate(current.createdAt)}</p>
          </button>

          {items.length > 1 && (
            <>
              <div className="absolute inset-y-0 left-2 flex items-center">
                <button
                  onClick={goPrev}
                  className="p-1.5 bg-white/90 hover:bg-white text-gray-700 rounded-full shadow"
                  aria-label="Previous news"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute inset-y-0 right-2 flex items-center">
                <button
                  onClick={goNext}
                  className="p-1.5 bg-white/90 hover:bg-white text-gray-700 rounded-full shadow"
                  aria-label="Next news"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 flex items-center justify-center gap-1.5">
                {items.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === normalizedIndex ? 'w-6 bg-blue-600' : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to news ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}
