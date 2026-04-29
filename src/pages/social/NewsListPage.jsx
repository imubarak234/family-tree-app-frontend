import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useDebounce } from '../../hooks/useDebounce';
import { useNews } from '../../hooks/social/useNews';
import {
  useDeleteNews,
  usePublishNews,
  useUnpublishNews,
  usePinNews,
  useUnpinNews,
} from '../../hooks/social/useNewsActions';
import NewsCard from '../../components/social/NewsCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  canViewNews,
  canCreateNews,
  canDeleteNews,
  canUpdateNews,
  canPublishNews,
  canPinNews,
} from '../../utils/permissions';
import { NEWS_STATUS_OPTIONS } from '../../utils/constants';

const PAGE_SIZE = 20;

export default function NewsListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [pinnedOnly, setPinnedOnly] = useState(false);
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 300);
  const { data, loading, error, refetch } = useNews({
    search: debouncedSearch,
    status: status || undefined,
    pinnedOnly,
    page,
    limit: PAGE_SIZE,
  });

  const { deleteNews } = useDeleteNews();
  const { publishNews } = usePublishNews();
  const { unpublishNews } = useUnpublishNews();
  const { pinNews } = usePinNews();
  const { unpinNews } = useUnpinNews();

  if (!canViewNews(user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No Access</h2>
          <p className="text-sm text-gray-500">You do not have permission to view news.</p>
        </div>
      </div>
    );
  }

  const items = data?.items || [];
  const total = data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">News</h1>
            <p className="text-gray-500 text-sm mt-1">{total} posts</p>
          </div>
          {canCreateNews(user) && (
            <button
              onClick={() => navigate('/news/new')}
              className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create News
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="Search title, excerpt, or content..."
            />
          </div>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">All statuses</option>
            {NEWS_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={pinnedOnly}
              onChange={(e) => {
                setPinnedOnly(e.target.checked);
                setPage(1);
              }}
            />
            Pinned only
          </label>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center"><LoadingSpinner /></div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            {error}
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center text-sm text-gray-500">
            No news posts found.
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <NewsCard
                key={item.id}
                item={item}
                onOpen={(n) => navigate(`/news/${n.id}`)}
                onEdit={(n) => navigate(`/news/${n.id}/edit`)}
                onDelete={async (n) => {
                  if (!canDeleteNews(user)) return;
                  if (!window.confirm('Delete this news post?')) return;
                  await deleteNews(n.id);
                  refetch();
                }}
                onTogglePin={async (n) => {
                  if (!canPinNews(user)) return;
                  if (n.isPinned) {
                    await unpinNews(n.id);
                  } else {
                    await pinNews(n.id);
                  }
                  refetch();
                }}
                onTogglePublish={async (n) => {
                  if (!canPublishNews(user)) return;
                  if (n.status === 'Published') {
                    await unpublishNews(n.id);
                  } else {
                    await publishNews(n.id);
                  }
                  refetch();
                }}
                canEdit={canUpdateNews(user)}
                canDelete={canDeleteNews(user)}
                canPin={canPinNews(user)}
                canPublish={canPublishNews(user)}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
