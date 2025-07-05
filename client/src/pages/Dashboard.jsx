import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Users, DollarSign, TrendingUp } from 'lucide-react';

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
    { label: 'Total Courses', value: '12', icon: BookOpen, color: 'bg-blue-500' },
    { label: 'Total Students', value: '1,234', icon: Users, color: 'bg-green-500' },
    { label: 'Total Revenue', value: '$15,678', icon: DollarSign, color: 'bg-purple-500' },
    { label: 'This Month', value: '$2,345', icon: TrendingUp, color: 'bg-orange-500' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mentor Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your teaching overview.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Course Performance</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">React Masterclass</p>
                  <p className="text-sm text-gray-600">45 new enrollments</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">+$1,234</p>
                  <p className="text-sm text-gray-600">This week</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full btn btn-primary">Create New Course</button>
            <button className="w-full btn btn-secondary">View All Courses</button>
            <button className="w-full btn btn-secondary">Check Analytics</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LearnerDashboard = () => {
  const stats = [
    { label: 'Enrolled Courses', value: '8', icon: BookOpen, color: 'bg-blue-500' },
    { label: 'Completed', value: '3', icon: BookOpen, color: 'bg-green-500' },
    { label: 'In Progress', value: '5', icon: BookOpen, color: 'bg-orange-500' },
    { label: 'Hours Watched', value: '47', icon: BookOpen, color: 'bg-purple-500' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Learning Dashboard</h1>
        <p className="text-gray-600">Continue your learning journey.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Continue Learning</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Advanced React Patterns</p>
                  <p className="text-sm text-gray-600">Progress: 67%</p>
                </div>
                <button className="btn btn-primary">Continue</button>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Courses</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Node.js Backend Development</p>
                  <p className="text-sm text-gray-600">By John Doe</p>
                </div>
                <button className="btn btn-secondary">View</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;