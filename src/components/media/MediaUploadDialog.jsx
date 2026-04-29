import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { X, Upload, FileText, Image } from 'lucide-react';
import { useState } from 'react';
import MediaDropzone from './MediaDropzone';
import { useUploadPhoto } from '../../hooks/useUploadPhoto';
import { useUploadDocument } from '../../hooks/useUploadDocument';
import {
  PHOTO_ACCEPT,
  DOCUMENT_ACCEPT,
  PHOTO_MAX_SIZE,
  DOCUMENT_MAX_SIZE,
} from '../../utils/constants';

const schema = yup.object({
  title: yup.string().max(200, 'Title must be 200 characters or less'),
  description: yup.string().max(1000, 'Description must be 1000 characters or less'),
});

export default function MediaUploadDialog({ open, onClose, mediaType, onSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [step, setStep] = useState('drop'); // 'drop' | 'meta'

  const { uploadPhoto, loading: photoLoading, error: photoError } = useUploadPhoto();
  const { uploadDocument, loading: docLoading, error: docError } = useUploadDocument();

  const loading = photoLoading || docLoading;
  const uploadError = photoError || docError;

  const isPhoto = mediaType === 'Photo';
  const accept = isPhoto ? PHOTO_ACCEPT : DOCUMENT_ACCEPT;
  const maxSize = isPhoto ? PHOTO_MAX_SIZE : DOCUMENT_MAX_SIZE;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedFile(null);
      setPreviewUrl(null);
      setStep('drop');
      reset();
    }
  }, [open, reset]);

  const handleFilesAccepted = (files) => {
    const file = files[0];
    setSelectedFile(file);
    if (isPhoto) {
      setPreviewUrl(URL.createObjectURL(file));
    }
    setStep('meta');
  };

  const onSubmit = async (values) => {
    const formData = new FormData();
    formData.append('file', selectedFile);
    if (values.title) formData.append('title', values.title);
    if (values.description) formData.append('description', values.description);

    try {
      const created = isPhoto
        ? await uploadPhoto(formData)
        : await uploadDocument(formData);
      onSuccess?.(created);
      onClose();
    } catch {
      // error already set in hook
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {isPhoto ? (
              <Image className="w-5 h-5 text-blue-600" />
            ) : (
              <FileText className="w-5 h-5 text-purple-600" />
            )}
            <h2 className="text-lg font-semibold text-gray-900">
              Upload {mediaType}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 py-5 space-y-5">
            {step === 'drop' ? (
              <MediaDropzone
                onFilesAccepted={handleFilesAccepted}
                accept={accept}
                maxSize={maxSize}
              />
            ) : (
              <>
                {/* File preview */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  {isPhoto && previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {selectedFile?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : ''}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      setStep('drop');
                    }}
                    className="ml-auto p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
                    aria-label="Remove selected file"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Title <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    {...register('title')}
                    placeholder={`e.g. ${isPhoto ? 'Family Reunion 2024' : 'Birth Certificate'}`}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  {errors.title && (
                    <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Description <span className="text-gray-400">(optional)</span>
                  </label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    placeholder="Add a description..."
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                  />
                  {errors.description && (
                    <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
                  )}
                </div>

                {uploadError && (
                  <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                    {uploadError}
                  </p>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {step === 'meta' && (
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                Upload
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
