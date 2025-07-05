import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Users, DollarSign, TrendingUp, Play, Plus, BarChart3, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  if (user.role === 'mentor') {
    return <MentorDashboard />;
  } else {
    return <LearnerDashboard />;
  }
};

const MentorDashboard = () => {
  const stats = [
    { label: 'Total Courses', value: '12', icon: BookOpen, color: 'bg-gray-900', change: '+2 this month' },
    { label: 'Total Students', value: '1,234', icon: Users, color: 'bg-gray-900', change: '+156 this week' },
    { label: 'Total Revenue', value: '$15,678', icon: DollarSign, color: 'bg-gray-900', change: '+$2,345 this month' },
    { label: 'This Month', value: '$2,345', icon: TrendingUp, color: 'bg-gray-900', change: '+12% vs last month' }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Mentor Dashboard</h1>
          <p className="text-lg text-gray-600">Welcome back! Here's your teaching overview and performance metrics.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-xs text-green-600 font-medium">{stat.change}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Course Performance */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Recent Course Performance</h3>
              <Link to="/my-courses" className="text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <div className="space-y-4">
              {[
                { title: 'React Masterclass', enrollments: '45', revenue: '+$1,234', period: 'This week' },
                { title: 'Node.js Backend', enrollments: '32', revenue: '+$856', period: 'This week' },
                { title: 'Python for Data Science', enrollments: '28', revenue: '+$1,089', period: 'This week' }
              ].map((course, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">{course.title}</p>
                    <p className="text-sm text-gray-600">{course.enrollments} new enrollments</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">{course.revenue}</p>
                    <p className="text-sm text-gray-600">{course.period}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
            <div className="space-y-4">
              <Link 
                to="/create-course"
                className="flex items-center justify-between w-full p-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Plus className="h-5 w-5" />
                  <span className="font-medium">Create New Course</span>
                </div>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link 
                to="/my-courses"
                className="flex items-center justify-between w-full p-4 bg-gray-50 text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-5 w-5" />
                  <span className="font-medium">View All Courses</span>
                </div>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <button className="flex items-center justify-between w-full p-4 bg-gray-50 text-gray-900 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-5 w-5" />
                  <span className="font-medium">Check Analytics</span>
                </div>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LearnerDashboard = () => {
  const stats = [
    { label: 'Enrolled Courses', value: '8', icon: BookOpen, color: 'bg-gray-900', change: '+2 this month' },
    { label: 'Completed', value: '3', icon: BookOpen, color: 'bg-gray-900', change: '+1 this week' },
    { label: 'In Progress', value: '5', icon: Play, color: 'bg-gray-900', change: '2 active now' },
    { label: 'Hours Watched', value: '47', icon: TrendingUp, color: 'bg-gray-900', change: '+12 this week' }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Learning Dashboard</h1>
          <p className="text-lg text-gray-600">Continue your learning journey and track your progress.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-xs text-green-600 font-medium">{stat.change}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Continue Learning */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Continue Learning</h3>
              <Link to="/enrolled-courses" className="text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <div className="space-y-4">
              {[
                { title: 'Advanced React Patterns', progress: '67%', instructor: 'Sarah Johnson' },
                { title: 'Node.js Backend Development', progress: '45%', instructor: 'Mike Chen' },
                { title: 'Python for Data Science', progress: '23%', instructor: 'David Rodriguez' }
              ].map((course, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{course.title}</p>
                    <p className="text-sm text-gray-600">Progress: {course.progress}</p>
                  </div>
                  <button className="bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors font-medium">
                    Continue
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Courses */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Recommended Courses</h3>
              <Link to="/courses" className="text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <div className="space-y-4">
              {[
                { title: 'Full Stack Development', instructor: 'John Doe', price: '$89' },
                { title: 'Machine Learning Basics', instructor: 'Jane Smith', price: '$99' },
                { title: 'DevOps Fundamentals', instructor: 'Alex Brown', price: '$79' }
              ].map((course, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{course.title}</p>
                    <p className="text-sm text-gray-600">By {course.instructor}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-900">{course.price}</span>
                    <button className="bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors font-medium">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;