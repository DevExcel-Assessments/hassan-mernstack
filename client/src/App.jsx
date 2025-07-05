import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from './components/ui';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Dashboard from './pages/Dashboard';
import CreateCourse from './pages/CreateCourse';
import MyCourses from './pages/MyCourses';
import EnrolledCourses from './pages/EnrolledCourses';
import VideoPlayer from './pages/VideoPlayer';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:id" element={<CourseDetail />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/create-course" 
                element={
                  <ProtectedRoute requiredRole="mentor">
                    <CreateCourse />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-courses" 
                element={
                  <ProtectedRoute requiredRole="mentor">
                    <MyCourses />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/enrolled-courses" 
                element={
                  <ProtectedRoute requiredRole="learner">
                    <EnrolledCourses />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/watch/:courseId" 
                element={
                  <ProtectedRoute>
                    <VideoPlayer />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <ToastContainer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;