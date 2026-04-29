import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNewsDetail } from '../../hooks/social/useNews';
import { useCreateNews, useUpdateNews } from '../../hooks/social/useNewsActions';
import NewsForm from '../../components/social/NewsForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { canCreateNews, canUpdateNews } from '../../utils/permissions';

export default function NewsFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const { user } = useAuth();

  const { data, loading: detailLoading, error: detailError } = useNewsDetail(id);
  const { createNews, loading: createLoading, error: createError } = useCreateNews();
  const { updateNews, loading: updateLoading, error: updateError } = useUpdateNews();

  if (!isEdit && !canCreateNews(user)) {
    return <div className="p-8 text-center text-gray-500">You do not have permission to create news posts.</div>;
  }

  if (isEdit && !canUpdateNews(user)) {
    return <div className="p-8 text-center text-gray-500">You do not have permission to edit news posts.</div>;
  }

  if (isEdit && detailLoading) {
    return <div className="py-16 flex justify-center"><LoadingSpinner /></div>;
  }

  if (isEdit && detailError) {
    return <div className="p-8 text-center text-red-600">{detailError}</div>;
  }

  const onSubmit = async (values) => {
    if (isEdit) {
      await updateNews(id, values);
      navigate(`/news/${id}`);
      return;
    }

    const created = await createNews(values);
    navigate(`/news/${created?.id || ''}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <button
          type="button"
          onClick={() => navigate(isEdit ? `/news/${id}` : '/news')}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {isEdit ? 'Edit News' : 'Create News'}
          </h1>
          <NewsForm
            initialValues={isEdit ? data : null}
            onSubmit={onSubmit}
            loading={createLoading || updateLoading}
            error={createError || updateError}
            submitLabel={isEdit ? 'Update News' : 'Create News'}
          />
        </div>
      </div>
    </div>
  );
}
