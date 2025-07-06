import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Play, Pause, Volume2, VolumeX, Maximize2, Clock, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import VideoService from '../services/videoService';

const VideoPreviewModal = ({ isOpen, onClose, course }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEnrollCTA, setShowEnrollCTA] = useState(false);
  
  const videoRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const isEnrolled = course?.enrolledUsers?.includes(user?.id) || false;

  useEffect(() => {
    if (isOpen && course) {
      setIsLoading(true);
      setError('');
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
      setShowEnrollCTA(false);
    }
  }, [isOpen, course]);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      const video = videoRef.current;
      
      const handleLoadedMetadata = () => {
        setDuration(video.duration);
        setIsLoading(false);
      };
      
      const handleTimeUpdate = () => {
        setCurrentTime(video.currentTime);
        
        if (video.currentTime >= 8 && !showEnrollCTA) {
          setShowEnrollCTA(true);
        }
      };
      
      const handleEnded = () => {
        setIsPlaying(false);
        setShowEnrollCTA(true);
      };
      
      const handleError = (e) => {
        console.error('Video error:', e);
        const videoError = e.target.error;
        
        if (videoError && videoError.code === 4) {
          setError('Authentication required. Please log in to preview this video.');
        } else {
          setError('Failed to load video preview. Please try again.');
        }
        setIsLoading(false);
      };
      
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('ended', handleEnded);
      video.addEventListener('error', handleError);
      
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('ended', handleEnded);
        video.removeEventListener('error', handleError);
      };
    }
  }, [isOpen, course, showEnrollCTA]);

  const handleLoginRedirect = () => {
    onClose();
    navigate('/login', { 
      state: { 
        from: '/courses',
        message: 'Please log in to preview course videos.'
      }
    });
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      const newTime = percentage * duration;
      
      const limitedTime = Math.min(newTime, 10);
      videoRef.current.currentTime = limitedTime;
      setCurrentTime(limitedTime);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getVideoUrl = () => {
    if (!course) return '';
    return VideoService.getVideoUrl(course._id, true); 
  };

  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{course.title}</h2>
            <p className="text-sm text-gray-600 mt-1">Video Preview (10 seconds)</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <div className="relative bg-black">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="text-white text-center p-6">
                <p className="text-lg font-medium mb-2">Preview Unavailable</p>
                <p className="text-sm opacity-75 mb-4">{error}</p>
                {error.includes('Authentication') && (
                  <button
                    onClick={handleLoginRedirect}
                    className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Log In to Preview
                  </button>
                )}
              </div>
            </div>
          )}

          <video
            ref={videoRef}
            className="w-full h-auto max-h-[60vh]"
            preload="metadata"
            playsInline
            muted={isMuted}
          >
            <source src={getVideoUrl()} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>Preview</span>
          </div>

          {showEnrollCTA && (
            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
              <div className="text-center text-white p-6">
                <Lock className="h-16 w-16 mx-auto mb-4 opacity-75" />
                <h3 className="text-2xl font-bold mb-2">Preview Ended</h3>
                <p className="text-lg mb-6 opacity-90">
                  Enroll in this course to watch the full video and access all content.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => window.location.href = `/courses/${course._id}`}
                    className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                  >
                    View Course Details
                  </button>
                  <button
                    onClick={onClose}
                    className="border border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-black transition-colors"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </div>
          )}

          {!showEnrollCTA && !error && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              
              <div 
                className="w-full h-1 bg-white bg-opacity-30 rounded-full cursor-pointer mb-3"
                onClick={handleSeek}
              >
                <div 
                  className="h-full bg-white rounded-full transition-all duration-150"
                  style={{ width: `${Math.min((currentTime / duration) * 100, 100)}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={togglePlay}
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </button>
                  
                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </button>
                  
                  <span className="text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(Math.min(duration, 10))}
                  </span>
                </div>
                
                <button className="text-white hover:text-gray-300 transition-colors">
                  <Maximize2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
              <p className="text-gray-600 text-sm line-clamp-2">{course.description}</p>
              <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                <span>By {course.mentor?.name || 'Unknown Mentor'}</span>
                <span>•</span>
                <span>{course.duration || 'Unknown'} duration</span>
                <span>•</span>
                <span>{course.enrolledCount || 0} enrolled</span>
              </div>
            </div>
            <div className="text-right ml-4">
              <div className="text-2xl font-bold text-gray-900">
                ${course.price || 0}
              </div>
              <div className="text-sm text-gray-500">Course Price</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPreviewModal; 