import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseService from '../services/courseService.js';
import { Upload, Plus, X, Clock, FileVideo, AlertCircle, CheckCircle } from 'lucide-react';

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
  const [uploadProgress, setUploadProgress] = useState(0);

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
      // Reset error state
      setError('');
      
      // Validate video file using service
      const validation = CourseService.validateVideoFile(file);
      if (!validation.isValid) {
        setError(Object.values(validation.errors)[0]);
        return;
      }
      
      setVideoFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const courseData = { ...formData, video: videoFile };
    const validation = CourseService.validateCourseData(courseData);
    
    if (!validation.isValid) {
      setError(Object.values(validation.errors)[0]);
      return;
    }

    setUploading(true);
    setError('');
    setUploadProgress(0);

    try {
      // Create course using service
      const result = await CourseService.createCourse(courseData, setUploadProgress);
      
      if (result.success) {
        // Show success message and redirect
        alert('Course created successfully!');
        navigate('/my-courses');
      } else {
        setError(result.error || 'Failed to create course');
      }
    } catch (error) {
      console.error('Error creating course:', error);
      setError('Failed to create course');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Course</h1>
          <p className="text-lg text-gray-600">Share your knowledge with the developer community</p>
        </div>
        
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-red-700 font-medium">{error}</span>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Course Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="Enter course title"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="Describe what students will learn in this course"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
                  Level
                </label>
                <select
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
          </div>

          {/* Video Upload */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Course Video</h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Maximum duration: 5 minutes</span>
                <span>•</span>
                <span>Maximum size: 100MB</span>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors">
                {videoFile ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-2 text-green-600">
                      <CheckCircle className="h-8 w-8" />
                      <div className="text-left">
                        <p className="font-medium">{videoFile.name}</p>
                        <p className="text-sm">Size: {(videoFile.size / 1024 / 1024).toFixed(2)}MB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setVideoFile(null)}
                      className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
                    >
                      <X className="h-4 w-4" />
                      <span>Remove Video</span>
                    </button>
                  </div>
                ) : (
                  <div>
                    <FileVideo className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Upload your course video</p>
                    <p className="text-sm text-gray-500 mb-4">Supported formats: MP4, AVI, MOV, WMV, WebM</p>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                      className="hidden"
                      id="video-upload"
                    />
                    <label
                      htmlFor="video-upload"
                      className="inline-flex items-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Select Video</span>
                    </label>
                  </div>
                )}
              </div>
              
              {/* Upload Progress */}
              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Uploading video...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gray-900 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Additional Information</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="react, javascript, frontend, web development"
                />
              </div>
              
              <div>
                <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
                  Prerequisites (comma-separated)
                </label>
                <input
                  type="text"
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="Basic HTML knowledge, JavaScript fundamentals"
                />
              </div>
              
              <div>
                <label htmlFor="whatYouWillLearn" className="block text-sm font-medium text-gray-700 mb-2">
                  What Students Will Learn (comma-separated)
                </label>
                <input
                  type="text"
                  id="whatYouWillLearn"
                  name="whatYouWillLearn"
                  value={formData.whatYouWillLearn}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="Build modern web applications, Use React hooks, Create responsive designs"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/my-courses')}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !videoFile}
              className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating Course...</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Create Course</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;