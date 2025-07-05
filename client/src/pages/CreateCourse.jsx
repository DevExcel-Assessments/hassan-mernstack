import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Upload, Plus, X } from 'lucide-react';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    level: 'beginner',
    tags: '',
    requirements: '',
    whatYouWillLearn: ''
  });
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'DevOps',
    'Machine Learning',
    'Cybersecurity'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        setError('Video file must be less than 100MB');
        return;
      }
      
      if (!file.type.startsWith('video/')) {
        setError('Please select a valid video file');
        return;
      }
      
      setVideoFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!videoFile) {
      setError('Please select a video file');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      formDataToSend.append('video', videoFile);

      const response = await axios.post('/api/courses', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/my-courses');
    } catch (error) {
      console.error('Error creating course:', error);
      setError(error.response?.data?.message || 'Failed to create course');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Course</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Course Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="textarea"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="input"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                Level
              </label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="input"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Video (Max 5 minutes, 100MB)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {videoFile ? (
                <div className="space-y-2">
                  <div className="text-green-600">
                    <Upload className="h-8 w-8 mx-auto mb-2" />
                    <p className="font-medium">{videoFile.name}</p>
                    <p className="text-sm">Size: {(videoFile.size / 1024 / 1024).toFixed(2)}MB</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setVideoFile(null)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4 inline mr-1" />
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Click to upload video</p>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="hidden"
                    id="video-upload"
                  />
                  <label
                    htmlFor="video-upload"
                    className="cursor-pointer btn btn-secondary mt-2"
                  >
                    Select Video
                  </label>
                </div>
              )}
            </div>
          </div>
              
          <div className="space-y-4">
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="input"
                placeholder="react, javascript, frontend"
              />
            </div>
            
            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
                Requirements (comma-separated)
              </label>
              <input
                type="text"
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                className="input"
                placeholder="Basic HTML knowledge, JavaScript fundamentals"
              />
            </div>
            
            <div>
              <label htmlFor="whatYouWillLearn" className="block text-sm font-medium text-gray-700 mb-1">
                What Students Will Learn (comma-separated)
              </label>
              <input
                type="text"
                id="whatYouWillLearn"
                name="whatYouWillLearn"
                value={formData.whatYouWillLearn}
                onChange={handleChange}
                className="input"
                placeholder="Build modern web applications, Use React hooks, Create responsive designs"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/my-courses')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="btn btn-primary"
            >
              {uploading ? 'Creating Course...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;