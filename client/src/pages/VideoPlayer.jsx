import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Play, Pause } from 'lucide-react';

const VideoPlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    fetchCourseAndVideo();
  }, [courseId]);

  const fetchCourseAndVideo = async () => {
    try {
     
      const courseResponse = await axios.get(`/api/courses/${courseId}`);
      setCourse(courseResponse.data);

     
      const videoResponse = await axios.get(`/api/videos/${courseId}/info`);
      if (videoResponse.data.canAccess) {
        setVideoUrl(`/api/videos/${courseId}/stream`);
      }
    } catch (error) {
      console.error('Error fetching course or video:', error);
      setError(error.response?.data?.message || 'Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading video...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => navigate('/enrolled-courses')}
          className="btn btn-primary"
        >
          Back to My Courses
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
     
      <button
        onClick={() => navigate('/enrolled-courses')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to My Courses</span>
      </button>

     
      <div className="bg-black rounded-lg overflow-hidden">
        <video
          controls
          className="w-full h-auto"
          poster={course?.thumbnail}
          preload="metadata"
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

     
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{course?.title}</h1>
        <p className="text-gray-600 mb-4">{course?.description}</p>
        
        <div className="flex items-center space-x-6 text-sm text-gray-600">
          <span>Instructor: {course?.mentor?.name}</span>
          <span>Duration: {course?.duration} minutes</span>
          <span>Category: {course?.category}</span>
        </div>
      </div>

      
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Course Progress</h3>
          <span className="text-sm text-gray-600">Lesson 1 of 1</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full" 
            style={{ width: '100%' }}
          ></div>
        </div>
        
        <div className="flex justify-between">
          <button className="btn btn-secondary" disabled>
            Previous Lesson
          </button>
          <button className="btn btn-primary" disabled>
            Next Lesson
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;