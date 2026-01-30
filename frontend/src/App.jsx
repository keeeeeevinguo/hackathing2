import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [generatedVideos, setGeneratedVideos] = useState([]);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedImage || !productName) {
      setError('Please provide both product name and image');
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedVideos([]);
    setProgress('Uploading image...');

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('productName', productName);
      formData.append('productDescription', productDescription);

      setProgress('Analyzing product image with AI...');

      const response = await axios.post('/api/generate-ad', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          if (percentCompleted === 100) {
            setProgress('Generating ad script...');
            setTimeout(() => {
              setProgress('Creating video with audio using Sora AI...');
            }, 2000);
            setTimeout(() => {
              setProgress('Finalizing video with music and effects (this may take 1-3 minutes)...');
            }, 5000);
          }
        },
      });

      setGeneratedVideos(response.data.videos || []);
      setProgress('Video(s) generated successfully!');

    } catch (err) {
      console.error('Error generating video:', err);
      setError(err.response?.data?.message || 'Failed to generate video ad. Please try again.');
      setProgress('');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setProductName('');
    setProductDescription('');
    setSelectedImage(null);
    setImagePreview(null);
    setGeneratedVideos([]);
    setError(null);
    setProgress('');
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>AI Video Ad Generator</h1>
          <p>Upload a product image and generate a professional video advertisement powered by AI</p>
        </header>

        {generatedVideos.length === 0 ? (
          <form onSubmit={handleSubmit} className="upload-form">
            <div className="form-group">
              <label htmlFor="productName">Product Name *</label>
              <input
                type="text"
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g., Premium Wireless Headphones"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="productDescription">Product Description (optional)</label>
              <textarea
                id="productDescription"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="Add any specific details or selling points you want to highlight..."
                rows="3"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Product Image *</label>
              <div
                className={`dropzone ${imagePreview ? 'has-image' : ''}`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => !loading && document.getElementById('fileInput').click()}
              >
                {imagePreview ? (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Product preview" />
                    {!loading && (
                      <div className="change-image">Click to change image</div>
                    )}
                  </div>
                ) : (
                  <div className="dropzone-content">
                    <svg className="upload-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p>Drag and drop your product image here</p>
                    <p className="or-text">or</p>
                    <button type="button" className="browse-button">Browse Files</button>
                    <p className="file-info">PNG, JPG, WebP (Max 10MB)</p>
                  </div>
                )}
                <input
                  type="file"
                  id="fileInput"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {loading && (
              <div className="loading-container">
                <div className="spinner"></div>
                <p className="loading-text">{progress}</p>
                <p className="loading-subtext">This may take 1-3 minutes. Please don't close this page.</p>
              </div>
            )}

            <button
              type="submit"
              className="submit-button"
              disabled={loading || !selectedImage || !productName}
            >
              {loading ? 'Generating Video...' : 'Generate Video Ad'}
            </button>
          </form>
        ) : (
          <div className="result-container">
            <h2>Your Video Ad{generatedVideos.length > 1 ? 's are' : ' is'} Ready!</h2>
            {generatedVideos.map((item, index) => (
              <div key={index} className="video-card">
                {generatedVideos.length > 1 && (() => {
                  const label = typeof item.consumerProfile === 'object'
                    ? Object.entries(item.consumerProfile).map(([k, v]) => `${k}: ${v}`).join(', ')
                    : item.consumerProfile || '';
                  return (
                    <p className="video-label">Video {index + 1}: {label.substring(0, 60)}{label.length > 60 ? '...' : ''}</p>
                  );
                })()}
                <div className="video-container">
                  <video controls loop={generatedVideos.length === 1} autoPlay={index === 0}>
                    <source src={item.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                <a href={item.videoUrl} download className="download-button">
                  Download Video {generatedVideos.length > 1 ? index + 1 : ''}
                </a>
                {item.emailSent && (
                  <p className="email-sent-badge">Sent to their email</p>
                )}
              </div>
            ))}
            <button onClick={handleReset} className="new-video-button">
              Create Another Video
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
