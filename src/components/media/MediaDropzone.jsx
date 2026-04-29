import { useState, useRef } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';

export default function MediaDropzone({
  onFilesAccepted,
  accept = {},
  maxSize,
  multiple = false,
  disabled = false,
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [rejectionError, setRejectionError] = useState(null);
  const inputRef = useRef(null);

  const acceptedExtensions = Object.values(accept).flat().join(', ');
  const acceptedMimes = Object.keys(accept).join(',');

  const validateFile = (file) => {
    const mimeAllowed = Object.keys(accept).some((mime) => {
      if (mime.endsWith('/*')) {
        return file.type.startsWith(mime.slice(0, -2));
      }
      return file.type === mime;
    });

    if (Object.keys(accept).length > 0 && !mimeAllowed) {
      return `File type not accepted. Accepted: ${acceptedExtensions}`;
    }
    if (maxSize && file.size > maxSize) {
      const mb = (maxSize / (1024 * 1024)).toFixed(0);
      return `File is too large. Maximum size is ${mb} MB.`;
    }
    return null;
  };

  const processFiles = (fileList) => {
    setRejectionError(null);
    const files = Array.from(fileList);
    const toProcess = multiple ? files : [files[0]];
    const errors = toProcess.map(validateFile).filter(Boolean);
    if (errors.length > 0) {
      setRejectionError(errors[0]);
      return;
    }
    onFilesAccepted(toProcess);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;
    processFiles(e.dataTransfer.files);
  };

  const handleInputChange = (e) => {
    if (e.target.files?.length) {
      processFiles(e.target.files);
      e.target.value = '';
    }
  };

  let borderClass = 'border-gray-300 bg-gray-50 hover:bg-gray-100';
  if (isDragOver) borderClass = 'border-blue-500 bg-blue-50';
  if (rejectionError) borderClass = 'border-red-400 bg-red-50';
  if (disabled) borderClass = 'border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed';

  return (
    <div>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Upload file dropzone"
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${borderClass}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptedMimes}
          multiple={multiple}
          className="hidden"
          onChange={handleInputChange}
          disabled={disabled}
        />

        <div className="flex flex-col items-center gap-3">
          <div className={`p-3 rounded-full ${isDragOver ? 'bg-blue-100' : 'bg-gray-200'}`}>
            <Upload className={`w-6 h-6 ${isDragOver ? 'text-blue-600' : 'text-gray-500'}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">
              {isDragOver ? 'Drop your file here' : 'Drag & drop or click to browse'}
            </p>
            {acceptedExtensions && (
              <p className="text-xs text-gray-500 mt-1">
                Accepted: {acceptedExtensions}
              </p>
            )}
            {maxSize && (
              <p className="text-xs text-gray-500">
                Max size: {(maxSize / (1024 * 1024)).toFixed(0)} MB
              </p>
            )}
          </div>
        </div>
      </div>

      {rejectionError && (
        <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{rejectionError}</span>
          <button
            type="button"
            onClick={() => setRejectionError(null)}
            className="ml-auto"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
