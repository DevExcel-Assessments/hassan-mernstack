import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardService from '../services/dashboardService.js';
import DashboardAnalyticsService from '../services/dashboardAnalyticsService.js';
import RevenueChart from '../components/charts/RevenueChart.jsx';
import CoursePerformanceChart from '../components/charts/CoursePerformanceChart.jsx';
import EnrollmentTrendChart from '../components/charts/EnrollmentTrendChart.jsx';
import StudentEngagementChart from '../components/charts/StudentEngagementChart.jsx';
import { BookOpen, Users, DollarSign, TrendingUp, Play, Plus, BarChart3, ArrowRight, Clock, Star, Calendar, Filter } from 'lucide-react';
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
  const [stats, setStats] = useState(null);
  const [recentCourses, setRecentCourses] = useState([]);
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeframe, setTimeframe] = useState('6months');

  useEffect(() => {
    fetchMentorData();
  }, []);

  const fetchMentorData = async () => {
    try {
      setLoading(true);
      
     
      const [statsResult, coursesResult, revenueData, coursePerformanceData, enrollmentData, engagementData] = await Promise.all([
        DashboardService.getMentorStats(),
        DashboardService.getMentorRecentCourses(),
        DashboardAnalyticsService.getRevenueChartData(timeframe),
        DashboardAnalyticsService.getCoursePerformanceData(),
        DashboardAnalyticsService.getEnrollmentTrends('6weeks'),
        DashboardAnalyticsService.getStudentEngagementData()
      ]);

      if (statsResult.success) {
        setStats(statsResult.stats);
      } else {
        setError(statsResult.error);
      }

      if (coursesResult.success) {
        setRecentCourses(coursesResult.courses);
      }

     
      setChartData({
        revenue: revenueData.success ? revenueData.data : null,
        coursePerformance: coursePerformanceData.success ? coursePerformanceData.data : null,
        enrollment: enrollmentData.success ? enrollmentData.data : null,
        engagement: engagementData.success ? engagementData.data : null
      });

     
      if (!revenueData.success) {
        console.error('Revenue chart error:', revenueData.error);
      }
      if (!coursePerformanceData.success) {
        console.error('Course performance chart error:', coursePerformanceData.error);
      }
      if (!enrollmentData.success) {
        console.error('Enrollment chart error:', enrollmentData.error);
      }
      if (!engagementData.success) {
        console.error('Engagement chart error:', engagementData.error);
      }

    } catch (error) {
      console.error('Error fetching mentor data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  const statsData = [
    { 
      label: 'Total Courses', 
      value: stats?.totalCourses || 0, 
      icon: BookOpen, 
      color: 'bg-gray-900', 
      change: `${stats?.publishedCourses || 0} published` 
    },
    { 
      label: 'Total Students', 
      value: DashboardService.formatNumber(stats?.totalStudents || 0), 
      icon: Users, 
      color: 'bg-gray-900', 
      change: `+${stats?.recentEnrollments || 0} this week` 
    },
    { 
      label: 'Total Revenue', 
      value: DashboardService.formatCurrency(stats?.totalRevenue || 0), 
      icon: DollarSign, 
      color: 'bg-gray-900', 
      change: `+${DashboardService.formatCurrency(stats?.thisMonthRevenue || 0)} this month` 
    },
    { 
      label: 'Monthly Growth', 
      value: `${stats?.monthlyGrowth || 0}%`, 
      icon: TrendingUp, 
      color: 'bg-gray-900', 
      change: `vs last month` 
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
       
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Mentor Dashboard</h1>
          <p className="text-lg text-gray-600">Welcome back! Here's your teaching overview and performance metrics.</p>
        </div>

       
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-red-700 font-medium">{error}</span>
            </div>
          </div>
        )}

       
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statsData.map((stat, index) => (
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

       
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Timeframe:</span>
            </div>
            <select
              value={timeframe}
              onChange={(e) => {
                setTimeframe(e.target.value);
                fetchMentorData();
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
            </select>
          </div>
        </div>

       
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
         
          <RevenueChart 
            data={chartData.revenue} 
            title="Revenue & Enrollments Overview" 
          />
          
         
          <CoursePerformanceChart 
            data={chartData.coursePerformance} 
            title="Course Performance Analysis" 
          />
        </div>

       
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
         
          <EnrollmentTrendChart 
            data={chartData.enrollment} 
            title="Enrollment Trends" 
          />
          
              
          <StudentEngagementChart 
            data={chartData.engagement} 
            title="Student Engagement Distribution" 
          />
        </div>

       
        <div className="grid lg:grid-cols-2 gap-8">
         
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Recent Course Performance</h3>
              <Link to="/my-courses" className="text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <div className="space-y-4">
              {recentCourses.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No courses yet. Create your first course to see performance data.</p>
                </div>
              ) : (
                recentCourses.slice(0, 3).map((course, index) => (
                  <div key={course._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">{course.title}</p>
                      <p className="text-sm text-gray-600">{course.weeklyEnrollments} new enrollments this week</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">+{DashboardService.formatCurrency(course.weeklyRevenue)}</p>
                      <p className="text-sm text-gray-600">This week</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

         
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
  const [stats, setStats] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLearnerData();
  }, []);

  const fetchLearnerData = async () => {
    try {
      setLoading(true);
      
     
      const [statsResult, enrolledResult, recommendedResult] = await Promise.all([
        DashboardService.getLearnerStats(),
        DashboardService.getLearnerEnrolledCourses(),
        DashboardService.getRecommendedCourses()
      ]);

      if (statsResult.success) {
        setStats(statsResult.stats);
      } else {
        setError(statsResult.error);
      }

      if (enrolledResult.success) {
        setEnrolledCourses(enrolledResult.courses);
      }

      if (recommendedResult.success) {
        setRecommendedCourses(recommendedResult.courses);
      }
    } catch (error) {
      console.error('Error fetching learner data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  const statsData = [
    { 
      label: 'Enrolled Courses', 
      value: stats?.enrolledCourses || 0, 
      icon: BookOpen, 
      color: 'bg-gray-900', 
      change: `+${stats?.recentEnrollments || 0} this month` 
    },
    { 
      label: 'Completed', 
      value: stats?.completedCourses || 0, 
      icon: BookOpen, 
      color: 'bg-gray-900', 
      change: `${stats?.averageProgress || 0}% average` 
    },
    { 
      label: 'In Progress', 
      value: stats?.inProgressCourses || 0, 
      icon: Play, 
      color: 'bg-gray-900', 
      change: 'active now' 
    },
    { 
      label: 'Hours Watched', 
      value: stats?.totalHoursWatched || 0, 
      icon: TrendingUp, 
      color: 'bg-gray-900', 
      change: 'total learning time' 
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
       
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Learning Dashboard</h1>
          <p className="text-lg text-gray-600">Continue your learning journey and track your progress.</p>
        </div>

       
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-red-700 font-medium">{error}</span>
            </div>
          </div>
        )}

       
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statsData.map((stat, index) => (
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

       
        <div className="grid lg:grid-cols-2 gap-8">
         
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Continue Learning</h3>
              <Link to="/enrolled-courses" className="text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <div className="space-y-4">
              {enrolledCourses.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No enrolled courses yet. Start learning to see your progress.</p>
                </div>
              ) : (
                enrolledCourses.slice(0, 3).map((course) => (
                  <div key={course._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{course.title}</p>
                      <p className="text-sm text-gray-600">Progress: {course.progress}%</p>
                    </div>
                    <Link 
                      to={`/watch/${course._id}`}
                      className="bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors font-medium"
                    >
                      Continue
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

                
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Recommended Courses</h3>
              <Link to="/courses" className="text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <div className="space-y-4">
              {recommendedCourses.length === 0 ? (
                <div className="text-center py-8">
                  <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No recommendations yet. Enroll in courses to get personalized recommendations.</p>
                </div>
              ) : (
                recommendedCourses.slice(0, 3).map((course) => (
                  <div key={course._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{course.title}</p>
                      <p className="text-sm text-gray-600">By {course.mentor?.name || 'Unknown Instructor'}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-900">{DashboardService.formatCurrency(course.price)}</span>
                      <Link 
                        to={`/courses/${course._id}`}
                        className="bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors font-medium"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;