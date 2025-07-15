import React, { useEffect, useState, useRef } from 'react';
import { getGallery, addImage, deleteImage, uploadFiles } from '../api';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

// Helper to get the correct media URL
const BACKEND_URL = process.env.REACT_APP_API_URL?.replace(/\/api$/, '') || 'http://localhost:5000';
const getMediaUrl = (url) => {
  if (url.startsWith('/uploads/')) {
    return `${BACKEND_URL}${url}`;
  }
  // If it's just a filename (no slashes, not a full URL), prepend /uploads/
  if (!url.startsWith('http') && !url.includes('/') && url.length < 100) {
    return `${BACKEND_URL}/uploads/${url}`;
  }
  return url;
};

const Gallery = () => {
  // All hooks at the top (no isGuest state)
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [mediaType, setMediaType] = useState('image');
  const [refresh, setRefresh] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [description, setDescription] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Always get isGuest from localStorage
  const isGuest = !localStorage.getItem('jwt');

  // Redirect effect
  useEffect(() => {
    if (!isGuest) {
      navigate('/dashboard', { replace: true });
    }
  }, [isGuest, navigate]);

  // Gallery fetch effect
  useEffect(() => {
    setLoading(true);
    getGallery()
      .then(data => {
        setImages(data);
        setError('');
      })
      .catch(() => setError('Грешка при зареждане на галерията.'))
      .finally(() => setLoading(false));
  }, [refresh]);

  // Only after ALL hooks:
  if (!isGuest) return null;

  const token = localStorage.getItem('jwt');
  let isAdmin = false;
  if (token) {
    try {
      isAdmin = jwtDecode(token).isAdmin;
    } catch {}
  }

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await addImage({ url, title, description, mediaType });
      if (res.imageId) {
        setUrl('');
        setTitle('');
        setDescription('');
        setMediaType('image');
        setRefresh(r => !r);
      } else {
        setError(res.message || 'Грешка при добавяне на медия.');
      }
    } catch (err) {
      setError(err.message || 'Грешка при добавяне на медия.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteImage(id);
      if (res.message && res.message.toLowerCase().includes('deleted')) {
        setRefresh(r => !r);
      } else {
        setError(res.message || 'Грешка при изтриване.');
      }
    } catch (err) {
      setError(err.message || 'Грешка при изтриване.');
    }
  };

  // File validation
  const validateFile = (file) => {
    const maxSize = 50 * 1024 * 1024; // 50MB
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/mov', 'video/avi'];
    
    if (file.size > maxSize) {
      throw new Error('Файлът е твърде голям. Максималният размер е 50MB.');
    }
    
    if (mediaType === 'image' && !allowedImageTypes.includes(file.type)) {
      throw new Error('Невалиден тип файл за изображение. Разрешени са: JPG, PNG, GIF, WEBP.');
    }
    
    if (mediaType === 'video' && !allowedVideoTypes.includes(file.type)) {
      throw new Error('Невалиден тип файл за видео. Разрешени са: MP4, WEBM, OGG, MOV, AVI.');
    }
    
    return true;
  };

  // Handle file upload
  const handleFileUpload = async (files) => {
    setUploading(true);
    setError('');
    try {
      // Validate all files first
      for (const file of files) {
        try {
          validateFile(file);
        } catch (validationError) {
          setError(validationError.message);
          return;
        }
      }
      // Upload files to backend (use only uploadFiles)
      const res = await uploadFiles(files, mediaType);
      if (res.message && res.message.includes('successfully')) {
        setRefresh(r => !r);
      } else {
        setError(res.message || 'Грешка при качване на файлове.');
      }
    } catch (err) {
      setError(err.message || 'Грешка при качване на файлове.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  // Function to render media content based on type
  const renderMedia = (item) => {
    if (item.mediaType === 'video') {
      // Handle different video platforms
      if (item.url.includes('youtube.com') || item.url.includes('youtu.be')) {
        // Convert YouTube URL to embed format
        const videoId = item.url.includes('youtu.be') 
          ? item.url.split('youtu.be/')[1]?.split('?')[0]
          : item.url.split('v=')[1]?.split('&')[0];
        
        if (videoId) {
          return (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={item.title}
              style={{ width: '100%', height: 180, border: 'none' }}
              allowFullScreen
            />
          );
        }
      } else if (item.url.includes('vimeo.com')) {
        // Convert Vimeo URL to embed format
        const videoId = item.url.split('vimeo.com/')[1]?.split('/')[0];
        
        if (videoId) {
          return (
            <iframe
              src={`https://player.vimeo.com/video/${videoId}`}
              title={item.title}
              style={{ width: '100%', height: 180, border: 'none' }}
              allowFullScreen
            />
          );
        }
      } else if (item.url.match(/\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)$/i) || item.url.startsWith('blob:') || item.url.startsWith('/uploads/')) {
        // Direct video file or uploaded file
        return (
          <video
            controls
            style={{ width: '100%', height: 180, objectFit: 'cover' }}
          >
            <source src={getMediaUrl(item.url)} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      }
      
      // Fallback for unsupported video URLs
      return (
        <div style={{ 
          width: '100%', 
          height: 180, 
          background: '#f0f0f0', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#666'
        }}>
          Video не може да се възпроизведе
        </div>
      );
    } else {
      // Image
      return (
        <img 
          src={getMediaUrl(item.url)} 
          alt={item.title} 
          style={{ width: '100%', height: 180, objectFit: 'cover' }} 
        />
      );
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 1100, margin: '2rem auto' }}>
      {isGuest && (
        <div style={{
          background: '#fffde7',
          border: '1px solid #ffd600',
          borderRadius: 12,
          padding: '1.5rem',
          marginBottom: '2rem',
          textAlign: 'center',
        }}>
          <div style={{ color: '#d32f2f', fontWeight: 500, fontSize: '1.15rem', marginBottom: '1rem' }}>
            За да поръчате услуга, е необходима регистрация.
          </div>
          <a
            href="/auth"
            style={{
              background: '#ffd600',
              color: '#d32f2f',
              padding: '0.8rem 2rem',
              borderRadius: 8,
              fontWeight: 'bold',
              fontSize: '1.1rem',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Регистрирай се
          </a>
        </div>
      )}
      {isAdmin && (
        <div style={{ marginBottom: '2rem' }}>
          {/* Drag and Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${isDragOver ? '#388e3c' : '#ccc'}`,
              borderRadius: 12,
              padding: '2rem',
              textAlign: 'center',
              cursor: 'pointer',
              background: isDragOver ? '#f0f8f0' : '#fafafa',
              transition: 'all 0.3s ease',
              marginBottom: '1rem'
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '0.5rem' }}>📁</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              {isDragOver ? 'Пуснете файловете тук' : 'Плъзнете файлове тук или кликнете за избор'}
            </div>
            <div style={{ color: '#666', fontSize: '14px' }}>
              Поддържани формати: {mediaType === 'image' ? 'JPG, PNG, GIF, WEBP' : 'MP4, WEBM, OGG, MOV, AVI'}
            </div>
            <div style={{ color: '#999', fontSize: '12px', marginTop: '0.5rem' }}>
              Максимален размер: 50MB
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={mediaType === 'image' ? 'image/*' : 'video/*'}
              onChange={handleFileInputChange}
              style={{ display: 'none' }}
            />
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div style={{ 
              background: '#e8f5e8', 
              padding: '1rem', 
              borderRadius: 8, 
              marginBottom: '1rem' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ width: '20px', height: '20px', border: '2px solid #388e3c', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <span>Качване на файлове...</span>
              </div>
              <div style={{ 
                width: '100%', 
                height: '4px', 
                background: '#ddd', 
                borderRadius: 2,
                overflow: 'hidden'
              }}>
                <div style={{ 
                  width: `${uploadProgress}%`, 
                  height: '100%', 
                  background: '#388e3c',
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
            </div>
          )}

          {/* Media Type Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <label style={{ fontWeight: 'bold', color: '#333' }}>Тип медия:</label>
            <select 
              value={mediaType} 
              onChange={e => setMediaType(e.target.value)}
              style={{ 
                padding: '0.5rem', 
                borderRadius: 6, 
                border: '1px solid #ccc', 
                width: 120 
              }}
            >
              <option value="image">Снимка</option>
              <option value="video">Видео</option>
            </select>
          </div>
        </div>
      )}

      {loading ? (
        <div>Зареждане...</div>
      ) : error ? (
        <div style={{ color: '#d32f2f', textAlign: 'center' }}>{error}</div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '2rem',
          justifyItems: 'center',
        }}>
          {images.map((item, idx) => (
            <div key={item.id || idx} style={{ 
              background: '#fff', 
              borderRadius: 16, 
              boxShadow: '0 2px 16px rgba(0,0,0,0.10)', 
              overflow: 'hidden', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              position: 'relative',
              width: '100%',
              maxWidth: 320
            }}>
              {renderMedia(item)}
              <div style={{ 
                padding: '1.25rem', 
                color: '#388e3c', 
                fontWeight: 500, 
                textAlign: 'center',
                width: '100%'
              }}>
                {item.title}
                {item.description && (
                  <div style={{ fontSize: '13px', color: '#444', marginTop: '0.5rem', fontWeight: 400 }}>{item.description}</div>
                )}
                <div style={{ 
                  fontSize: '14px', 
                  color: '#666', 
                  marginTop: '0.25rem' 
                }}>
                  {item.mediaType === 'video' ? 'Видео' : 'Снимка'}
                </div>
              </div>
              {isAdmin && (
                <button 
                  onClick={() => handleDelete(item.id)} 
                  style={{ 
                    position: 'absolute', 
                    top: 10, 
                    right: 10, 
                    background: '#d32f2f', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: 8, 
                    padding: '0.35rem 1rem', 
                    fontWeight: 'bold', 
                    cursor: 'pointer' 
                  }}
                >
                  Изтрий
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @media (max-width: 1600px) {
          div[style*='display: grid'] {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
        @media (max-width: 1200px) {
          div[style*='display: grid'] {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 900px) {
          div[style*='display: grid'] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          div[style*='display: grid'] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Gallery; 