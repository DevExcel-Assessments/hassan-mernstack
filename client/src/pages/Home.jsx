import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Video, Award } from 'lucide-react';

const Home = () => {
  return (
    <div className="space-y-16">
      <section className="text-center py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Learn from the Best
          <span className="block text-blue-600">Developer Mentors</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of developers learning cutting-edge technologies from industry experts. 
          Create, share, and monetize your technical knowledge.
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/courses" className="btn btn-primary text-lg px-8 py-3">
            Browse Courses
          </Link>
          <Link to="/register" className="btn btn-secondary text-lg px-8 py-3">
            Get Started
          </Link>
        </div>
      </section>

      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose DevCourse?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform is designed specifically for developers, by developers.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Content</h3>
            <p className="text-gray-600">Learn from industry professionals with real-world experience.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">HD Video Content</h3>
            <p className="text-gray-600">High-quality video lessons with secure streaming.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
            <p className="text-gray-600">Connect with fellow developers and grow together.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Certificates</h3>
            <p className="text-gray-600">Get recognized for your learning achievements.</p>
          </div>
        </div>
      </section>

    
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 rounded-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl mb-8">Join thousands of developers advancing their careers.</p>
          <div className="flex justify-center space-x-4">
            <Link to="/register" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Sign Up Now
            </Link>
            <Link to="/courses" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Browse Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;