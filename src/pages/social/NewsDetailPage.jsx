import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNewsDetail } from '../../hooks/social/useNews';
import { useDeleteNews } from '../../hooks/social/useNewsActions';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate } from '../../utils/formatters';
import {
  canViewNews,
  canUpdateNews,
  canDeleteNews,
} from '../../utils/permissions';
import { useComments, useReactions } from '../../hooks/social/useEngagement';
import CommentsThread from '../../components/social/CommentsThread';
import ReactionsBar from '../../components/social/ReactionsBar';

export default function NewsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: item, loading, error } = useNewsDetail(id);
  const { deleteNews, loading: deleting } = useDeleteNews();

  const { data: comments, refetch: refetchComments } = useComments('news', id);
  const { data: reactions, refetch: refetchReactions } = useReactions('news', id);

  if (!canViewNews(user)) {
    return <div className="p-8 text-center text-gray-500">You do not have permission to view this news post.</div>;
  }

  if (loading) {
    return <div className="py-16 flex justify-center"><LoadingSpinner /></div>;
  }

  if (error || !item) {
    return <div className="p-8 text-center text-red-600">{error || 'News post not found.'}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <button
          type="button"
          onClick={() => navigate('/news')}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to News
        </button>

        <article className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{item.title}</h1>
              <p className="text-xs text-gray-400 mt-1">{formatDate(item.createdAt)}</p>
            </div>
            <div className="flex items-center gap-1">
              {canUpdateNews(user) && (
                <button
                  type="button"
                  onClick={() => navigate(`/news/${item.id}/edit`)}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
              {canDeleteNews(user) && (
                <button
                  type="button"
                  disabled={deleting}
                  onClick={async () => {
                    if (!window.confirm('Delete this news post?')) return;
                    await deleteNews(item.id);
                    navigate('/news');
                  }}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {item.excerpt && <p className="text-gray-600 mb-4">{item.excerpt}</p>}
          <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">{item.content}</div>
        </article>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-4">
          <ReactionsBar
            resource="news"
            targetId={id}
            reactions={reactions}
            currentUser={user}
            onChanged={refetchReactions}
          />
          <CommentsThread
            resource="news"
            targetId={id}
            comments={comments}
            currentUser={user}
            onChanged={refetchComments}
          />
        </div>
      </div>
    </div>
  );
}
