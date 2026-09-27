import React, { useRef, useState } from 'react';
import './CloudinaryUpload.css';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'bxov0ssr';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'portfolio_uploads';

const CloudinaryUpload = ({ 
  onUpload, 
  accept = 'image/*', 
  label = 'Upload File',
  hint = '',
  currentUrl = '',
  type = 'image', // 'image' or 'document'
}) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(currentUrl);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size — 10MB max
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large — max 10MB');
      return;
    }

    setError('');
    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);

      // Use raw resource type for PDFs/docs
      const resourceType = type === 'document' ? 'raw' : 'image';
      const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;

      // Use XMLHttpRequest so we can track progress
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          const uploadedUrl = data.secure_url;
          setPreview(uploadedUrl);
          onUpload(uploadedUrl);
          setProgress(100);
        } else {
          setError('Upload failed — please try again');
        }
        setUploading(false);
      };

      xhr.onerror = () => {
        setError('Upload failed — check your internet connection');
        setUploading(false);
      };

      xhr.send(formData);
    } catch (err) {
      setError('Upload failed: ' + err.message);
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview('');
    onUpload('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="cu-wrapper">
      {/* Preview */}
      {preview && type === 'image' && (
        <div className="cu-preview-img">
          <img src={preview} alt="Preview" />
          <button type="button" className="cu-remove" onClick={handleRemove}>✕ Remove</button>
        </div>
      )}

      {preview && type === 'document' && (
        <div className="cu-preview-doc">
          <span className="cu-doc-icon">📄</span>
          <div className="cu-doc-info">
            <span className="cu-doc-label">File uploaded</span>
            <a href={preview} target="_blank" rel="noreferrer" className="cu-doc-link">
              View file ↗
            </a>
          </div>
          <button type="button" className="cu-remove" onClick={handleRemove}>✕</button>
        </div>
      )}

      {/* Upload zone */}
      {!preview && (
        <label className="cu-dropzone" onClick={() => inputRef.current?.click()}>
          <div className="cu-dropzone-icon">
            {type === 'image' ? '🖼' : '📄'}
          </div>
          <div className="cu-dropzone-text">{label}</div>
          {hint && <div className="cu-dropzone-hint">{hint}</div>}
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            hidden
          />
        </label>
      )}

      {/* Change button when preview exists */}
      {preview && !uploading && (
        <button
          type="button"
          className="cu-change-btn"
          onClick={() => inputRef.current?.click()}
        >
          ↑ Change {type === 'image' ? 'Photo' : 'File'}
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            hidden
          />
        </button>
      )}

      {/* Progress bar */}
      {uploading && (
        <div className="cu-progress-wrap">
          <div className="cu-progress-bar">
            <div className="cu-progress-fill" style={{width: `${progress}%`}} />
          </div>
          <span className="cu-progress-text">Uploading... {progress}%</span>
        </div>
      )}

      {/* Error */}
      {error && <div className="cu-error">⚠ {error}</div>}
    </div>
  );
};

export default CloudinaryUpload;
