import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Video, Award, ArrowRight, CheckCircle, Star, Play } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 via-white to-gray-100 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Learn from the Best
              <span className="block text-gray-900 mt-2">Developer Mentors</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join thousands of developers learning cutting-edge technologies from industry experts. 
              Create, share, and monetize your technical knowledge with our comprehensive learning platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link 
                to="/courses" 
                className="w-full sm:w-auto bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>Browse Courses</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link 
                to="/register" 
                className="w-full sm:w-auto bg-white text-gray-900 border-2 border-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-900 hover:text-white transition-all duration-200 transform hover:scale-105"
              >
                Get Started Free
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">10K+</div>
                <div className="text-gray-600">Active Learners</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
                <div className="text-gray-600">Expert Courses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">50+</div>
                <div className="text-gray-600">Industry Mentors</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose DevCourse?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform is designed specifically for developers, by developers, with everything you need to advance your career.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
              <div className="bg-gray-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Expert Content</h3>
              <p className="text-gray-600 leading-relaxed">Learn from industry professionals with real-world experience and proven track records.</p>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
              <div className="bg-gray-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Video className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">HD Video Content</h3>
              <p className="text-gray-600 leading-relaxed">High-quality video lessons with secure streaming and downloadable resources.</p>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
              <div className="bg-gray-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Active Community</h3>
              <p className="text-gray-600 leading-relaxed">Connect with fellow developers, share knowledge, and grow together in our vibrant community.</p>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
              <div className="bg-gray-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Certificates</h3>
              <p className="text-gray-600 leading-relaxed">Get recognized for your learning achievements with industry-recognized certificates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Courses Preview */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Popular Courses</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Start with our most popular courses and join thousands of satisfied learners.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Course Card 1 */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
              <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-2xl flex items-center justify-center">
                <Play className="h-12 w-12 text-white" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">React Masterclass</h3>
                <p className="text-gray-600 mb-4">Learn React from basics to advanced patterns with real-world projects.</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">4.8 (2.1k reviews)</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">$89</span>
                </div>
              </div>
            </div>

            {/* Course Card 2 */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
              <div className="h-48 bg-gradient-to-br from-green-500 to-blue-600 rounded-t-2xl flex items-center justify-center">
                <Play className="h-12 w-12 text-white" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Node.js Backend</h3>
                <p className="text-gray-600 mb-4">Build scalable backend applications with Node.js and Express.</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">4.9 (1.8k reviews)</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">$79</span>
                </div>
              </div>
            </div>

            {/* Course Card 3 */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
              <div className="h-48 bg-gradient-to-br from-purple-500 to-pink-600 rounded-t-2xl flex items-center justify-center">
                <Play className="h-12 w-12 text-white" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Python for Data Science</h3>
                <p className="text-gray-600 mb-4">Master Python programming for data analysis and machine learning.</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">4.7 (1.5k reviews)</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">$99</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Link 
              to="/courses" 
              className="inline-flex items-center space-x-2 bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200 transform hover:scale-105"
            >
              <span>View All Courses</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Students Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of developers who have transformed their careers with DevCourse.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                "DevCourse helped me transition from a junior developer to a senior role. The quality of content and community support is incredible."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <div className="font-semibold text-gray-900">Sarah Johnson</div>
                  <div className="text-sm text-gray-600">Senior Frontend Developer</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                "The practical projects and real-world examples made all the difference. I learned more in 3 months than in 2 years of self-study."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <div className="font-semibold text-gray-900">Mike Chen</div>
                  <div className="text-sm text-gray-600">Full Stack Developer</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                "As a mentor, I love how easy it is to create and share my knowledge. The platform is intuitive and the students are engaged."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <div className="font-semibold text-gray-900">David Rodriguez</div>
                  <div className="text-sm text-gray-600">Tech Lead & Mentor</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Learning?</h2>
            <p className="text-xl mb-8 text-gray-300">
              Join thousands of developers advancing their careers with DevCourse.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link 
                to="/register" 
                className="w-full sm:w-auto bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
              >
                Sign Up Now
              </Link>
              <Link 
                to="/courses" 
                className="w-full sm:w-auto border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-gray-900 transition-all duration-200 transform hover:scale-105"
              >
                Browse Courses
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;