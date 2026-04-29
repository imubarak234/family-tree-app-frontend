import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, FileText } from 'lucide-react';
import { useMedia } from '../../hooks/useMedia';
import { useDeleteMedia } from '../../hooks/useDeleteMedia';
import { useDebounce } from '../../hooks/useDebounce';
import { useAuth } from '../../hooks/useAuth';
import { canUploadDocument, canUpdateMedia, canDeleteMedia } from '../../utils/permissions';
import MediaCard from '../../components/media/MediaCard';
import MediaUploadDialog from '../../components/media/MediaUploadDialog';
import MediaEditDialog from '../../components/media/MediaEditDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const PAGE_SIZE = 20;

export default function DocumentsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteConfirming, setDeleteConfirming] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data, loading, error, refetch } = useMedia({
    mediaType: 'Document',
    search: debouncedSearch || undefined,
    page,
    limit: PAGE_SIZE,
  });

  const { deleteMedia } = useDeleteMedia();

  const items = data?.items || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleUploadSuccess = () => {
    refetch();
  };

  const handleEditSuccess = () => {
    refetch();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteConfirming(true);
    try {
      await deleteMedia(deleteTarget.id);
      setDeleteTarget(null);
      refetch();
    } catch {
      // error shown in hook
    } finally {
      setDeleteConfirming(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="w-8 h-8 text-purple-600" />
              Documents
            </h1>
            <p className="mt-1 text-gray-500">
              {total} {total === 1 ? 'document' : 'documents'}
            </p>
          </div>

          {canUploadDocument(user) && (
            <button
              onClick={() => setUploadOpen(true)}
              className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-medium text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Upload Document
            </button>
          )}
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents…"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500">{error}</p>
            <button
              onClick={refetch}
              className="mt-4 text-sm text-blue-600 hover:underline"
            >
              Try again
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No documents yet</h3>
            <p className="text-gray-400 text-sm mb-6">
              {debouncedSearch
                ? `No results for "${debouncedSearch}"`
                : 'Upload birth certificates, family documents, and more.'}
            </p>
            {canUploadDocument(user) && !debouncedSearch && (
              <button
                onClick={() => setUploadOpen(true)}
                className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium text-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Upload Document
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {items.map((item) => (
                <MediaCard
                  key={item.id}
                  item={item}
                  onClick={(i) => navigate(`/media/documents/${i.id}`)}
                  onEdit={(i) => setEditItem(i)}
                  onDelete={(i) => setDeleteTarget(i)}
                  canEdit={canUpdateMedia(user)}
                  canDelete={canDeleteMedia(user)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Dialogs */}
      <MediaUploadDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        mediaType="Document"
        onSuccess={handleUploadSuccess}
      />

      <MediaEditDialog
        open={!!editItem}
        onClose={() => setEditItem(null)}
        item={editItem}
        onSuccess={handleEditSuccess}
      />

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Document?</h3>
            <p className="text-sm text-gray-600 mb-6">
              "{deleteTarget.title || deleteTarget.originalName}" will be permanently deleted.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteConfirming}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-60"
              >
                {deleteConfirming ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
