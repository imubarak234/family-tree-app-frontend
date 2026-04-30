import { useMemo, useRef, useState } from 'react';
import { Camera, Loader2, Trash2, User } from 'lucide-react';
import { useUploadMemberPhoto } from '../../hooks/useUploadMemberPhoto';
import { useDeleteMemberPhoto } from '../../hooks/useDeleteMemberPhoto';
import { useMemberDetail } from '../../hooks/useMemberDetail';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function getBackendOrigin() {
  const baseUrl = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3000/api';
  return baseUrl.replace(/\/api\/?$/, '');
}

function getInitials(member) {
  const firstName = member?.firstName || member?.firstname || '';
  const lastName = member?.lastName || member?.lastname || '';
  const firstInitial = firstName.charAt(0).toUpperCase();
  const lastInitial = lastName.charAt(0).toUpperCase();
  const initials = `${firstInitial}${lastInitial}`.trim();
  return initials || 'FM';
}

function getPhotoPath(currentPhotoPath, member) {
  return currentPhotoPath || member?.profilePhoto || member?.photo || null;
}

export default function ProfilePhotoUploader({ memberId, currentPhotoPath, onSuccess }) {
  const inputRef = useRef(null);
  const [imgError, setImgError] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const { member } = useMemberDetail(memberId);
  const { uploadMemberPhoto, loading: uploading } = useUploadMemberPhoto();
  const { deleteMemberPhoto, loading: deleting } = useDeleteMemberPhoto();

  const busy = uploading || deleting;
  const photoPath = getPhotoPath(currentPhotoPath, member);
  const photoUrl = useMemo(() => {
    if (!photoPath) return null;
    return `${getBackendOrigin()}/${String(photoPath).replace(/^\/+/, '')}`;
  }, [photoPath]);

  const initials = getInitials(member);

  const handleSelectClick = () => {
    if (busy) return;
    inputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFeedback({ type: 'error', message: 'Please select an image file.' });
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setFeedback({ type: 'error', message: 'Image must be 5MB or smaller.' });
      return;
    }

    try {
      await uploadMemberPhoto(memberId, file);
      setImgError(false);
      setFeedback({ type: 'success', message: 'Profile photo updated successfully.' });
      onSuccess?.();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to upload photo.' });
    }
  };

  const handleDeletePhoto = async () => {
    try {
      await deleteMemberPhoto(memberId);
      setShowDeleteConfirm(false);
      setImgError(false);
      setFeedback({ type: 'success', message: 'Profile photo removed successfully.' });
      onSuccess?.();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete photo.' });
    }
  };

  const showPhoto = Boolean(photoUrl) && !imgError;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative group">
        <button
          type="button"
          onClick={handleSelectClick}
          className="relative w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-lg bg-gradient-to-br from-blue-100 to-purple-100"
          title="Upload or replace profile photo"
        >
          {showPhoto ? (
            <img
              src={photoUrl}
              alt="Member profile"
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
              <User className="w-10 h-10 mb-1" />
              <span className="text-sm font-semibold tracking-wide">{initials}</span>
            </div>
          )}

          {busy && (
            <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
        </button>

        <button
          type="button"
          onClick={handleSelectClick}
          disabled={busy}
          className="absolute bottom-1 right-1 p-2 rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-colors disabled:opacity-60"
          title="Upload or replace photo"
        >
          <Camera className="w-4 h-4" />
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {photoPath && (
        <button
          type="button"
          onClick={() => setShowDeleteConfirm(true)}
          disabled={busy}
          className="inline-flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 disabled:opacity-60"
        >
          <Trash2 className="w-4 h-4" />
          Remove Photo
        </button>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowDeleteConfirm(false)}
            aria-label="Close dialog"
          />
          <div className="relative bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete photo?</h3>
            <p className="text-sm text-gray-600 mb-5">
              This will remove the current profile photo for this family member.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={busy}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
                onClick={handleDeletePhoto}
                disabled={busy}
              >
                {deleting ? 'Removing...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {feedback.message && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg text-sm shadow-lg ${
            feedback.type === 'success'
              ? 'bg-green-600 text-white'
              : 'bg-red-600 text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <span>{feedback.message}</span>
            <button
              type="button"
              className="text-white/80 hover:text-white"
              onClick={() => setFeedback({ type: '', message: '' })}
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
