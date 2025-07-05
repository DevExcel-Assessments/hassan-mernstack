import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Plus, Edit, Trash2, Users, DollarSign } from 'lucide-react';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const response = await axios.get('/api/courses/mentor/my-courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`/api/courses/${courseId}`);
        setCourses(courses.filter(course => course._id !== courseId));
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Failed to delete course');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600">Manage your courses and track performance</p>
        </div>
        <Link to="/create-course" className="btn btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Create Course
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You haven't created any courses yet.</p>
          <Link to="/create-course" className="btn btn-primary">
            Create Your First Course
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {courses.map(course => (
            <div key={course._id} className="card p-6">
              <div className="flex items-start space-x-4">
                <img 
                  src={course.thumbnail || '/api/placeholder/150/100'} 
                  alt={course.title}
                  className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
                />
                
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{course.enrolledCount || 0} students</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4" />
                      <span>${course.price}</span>
                    </div>
                    <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                      {course.category}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      course.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {course.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Link 
                    to={`/courses/${course._id}`}
                    className="btn btn-secondary"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(course._id)}
                    className="btn bg-red-100 text-red-600 hover:bg-red-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;