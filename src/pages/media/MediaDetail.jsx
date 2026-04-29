import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Download,
  Image,
  FileText,
  Calendar,
  HardDrive,
} from 'lucide-react';
import { useMediaItem } from '../../hooks/useMediaItem';
import { useDeleteMedia } from '../../hooks/useDeleteMedia';
import { useAuth } from '../../hooks/useAuth';
import { canUpdateMedia, canDeleteMedia, canTagPhoto } from '../../utils/permissions';
import { getMediaUrl, formatDate, formatFileSize } from '../../utils/formatters';
import MediaEditDialog from '../../components/media/MediaEditDialog';
import PhotoTagsPanel from '../../components/media/PhotoTagsPanel';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function MediaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: item, loading, error, refetch } = useMediaItem(id);
  const { deleteMedia, loading: deleteLoading } = useDeleteMedia();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const isPhoto = item?.mediaType === 'Photo';
  const backPath = isPhoto ? '/media/photos' : '/media/documents';

  const handleEditSuccess = () => {
    refetch();
  };

  const handleDelete = async () => {
    try {
      await deleteMedia(id);
      navigate(backPath);
    } catch {
      // error shown inline
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">{error || 'Media item not found.'}</p>
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline text-sm"
        >
          Go back
        </button>
      </div>
    );
  }

  const imageUrl = getMediaUrl(item.filePath);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back nav */}
        <button
          onClick={() => navigate(backPath)}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {isPhoto ? 'Photos' : 'Documents'}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Main content */}
          <div className="lg:col-span-3 space-y-4">
            {/* Media display */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {isPhoto ? (
                imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={item.title || item.originalName}
                    className="w-full object-contain max-h-[60vh] bg-gray-900"
                  />
                ) : (
                  <div className="flex items-center justify-center h-64 bg-gray-100">
                    <Image className="w-16 h-16 text-gray-300" />
                  </div>
                )
              ) : (
                <div className="flex items-center justify-center h-48 bg-gradient-to-br from-purple-50 to-indigo-50">
                  <FileText className="w-16 h-16 text-purple-200" />
                </div>
              )}
            </div>

            {/* Photo tags */}
            {isPhoto && (
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <PhotoTagsPanel photoId={item.id} canTag={canTagPhoto(user)} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-4">
            {/* Title & actions */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h1 className="text-xl font-bold text-gray-900 break-words">
                  {item.title || item.originalName}
                </h1>
                <div className="flex gap-2 flex-shrink-0">
                  {canUpdateMedia(user) && (
                    <button
                      onClick={() => setEditOpen(true)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4 text-gray-600" />
                    </button>
                  )}
                  {canDeleteMedia(user) && (
                    <button
                      onClick={() => setDeleteConfirm(true)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  )}
                </div>
              </div>

              {item.description && (
                <p className="text-sm text-gray-600 mb-3">{item.description}</p>
              )}

              {/* Download button for documents */}
              {!isPhoto && (
                <a
                  href={imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
              )}
            </div>

            {/* Metadata */}
            <div className="bg-white rounded-2xl shadow-sm p-5 space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Details
              </h3>

              <div className="flex items-start gap-3 text-sm">
                <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Original filename</p>
                  <p className="text-gray-700 break-all">{item.originalName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm">
                <HardDrive className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">File size</p>
                  <p className="text-gray-700">{formatFileSize(item.fileSize)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm">
                <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Uploaded</p>
                  <p className="text-gray-700">{formatDate(item.createdAt)}</p>
                </div>
              </div>

              {item.updatedAt !== item.createdAt && (
                <div className="flex items-start gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Last updated</p>
                    <p className="text-gray-700">{formatDate(item.updatedAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit dialog */}
      <MediaEditDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        item={item}
        onSuccess={handleEditSuccess}
      />

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteConfirm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete {item.mediaType}?
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              "{item.title || item.originalName}" will be permanently deleted.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-60"
              >
                {deleteLoading ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
