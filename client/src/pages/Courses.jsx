import React, { useState, useEffect, useCallback } from 'react';
import CourseService from '../services/courseService.js';
import CourseCard from '../components/CourseCard';
import VideoPreviewModal from '../components/VideoPreviewModal';
import { Search, Filter, AlertCircle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('newest');
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 12
  });

  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    course: null
  });
  
  const [availableFilters, setAvailableFilters] = useState({
    categories: [
      'Web Development',
      'Mobile Development', 
      'Data Science',
      'DevOps',
      'Machine Learning',
      'Cybersecurity'
    ],
    levels: ['beginner', 'intermediate', 'advanced'],
    priceRange: { minPrice: 0, maxPrice: 0 }
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchCourses = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError('');

      const params = {
        page,
        limit: 12,
        search: debouncedSearchTerm,
        category: selectedCategory,
        level: selectedLevel,
        sortBy,
        ...(priceRange.min && { minPrice: priceRange.min }),
        ...(priceRange.max && { maxPrice: priceRange.max })
      };

      const result = await CourseService.getAllCourses(params);
      
      if (result.success) {
        setCourses(result.courses);
        setPagination(result.pagination);
        if (result.filters) {
          setAvailableFilters(prev => ({
            ...prev,
            // Safely update filters with fallbacks
            categories: result.filters.availableCategories || prev.categories,
            levels: result.filters.availableLevels || prev.levels,
            priceRange: result.filters.priceRange || prev.priceRange
          }));
        }
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to load courses. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, selectedCategory, selectedLevel, sortBy, priceRange]);

  useEffect(() => {
    fetchCourses(1);
  }, [fetchCourses]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchCourses(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedLevel('');
    setPriceRange({ min: '', max: '' });
    setSortBy('newest');
  };

  const handlePreviewClick = (course) => {
    setPreviewModal({
      isOpen: true,
      course
    });
  };

  const handleClosePreview = () => {
    setPreviewModal({
      isOpen: false,
      course: null
    });
  };

  const hasActiveFilters = searchTerm || selectedCategory || selectedLevel || 
    priceRange.min || priceRange.max || sortBy !== 'newest';

  if (loading && courses.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
            <div className="text-lg text-gray-600">Loading courses...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Explore Courses</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover and learn from expert developers across various technologies and domains
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-red-700 font-medium">{error}</span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
              />
            </div>

            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
              >
                <option value="">All Categories</option>
                {(availableFilters.categories || []).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
              >
                <option value="">All Levels</option>
                {(availableFilters.levels || []).map(level => (
                  <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
              <input
                type="number"
                placeholder="Min price"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
              <input
                type="number"
                placeholder="Max price"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleResetFilters}
                className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="mb-4 sm:mb-0">
            <p className="text-gray-600">
              {pagination.total} course{pagination.total !== 1 ? 's' : ''} found
              {hasActiveFilters && (
                <span className="text-gray-400 ml-2">
                  (showing page {pagination.currentPage} of {pagination.totalPages})
                </span>
              )}
            </p>
          </div>
          
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  Search: "{searchTerm}"
                </span>
              )}
              {selectedCategory && (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  Category: {selectedCategory}
                </span>
              )}
              {selectedLevel && (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  Level: {selectedLevel}
                </span>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
              <div className="text-lg text-gray-600">Loading courses...</div>
            </div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600 mb-4">
                {hasActiveFilters 
                  ? "Try adjusting your search criteria or browse all courses."
                  : "No courses are available at the moment. Please check back later."
                }
              </p>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {courses.map(course => (
                <CourseCard key={course._id} course={course} onPreviewClick={handlePreviewClick} />
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-4 py-2 rounded-xl transition-colors ${
                          pageNum === pagination.currentPage
                            ? 'bg-gray-900 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {previewModal.isOpen && (
        <VideoPreviewModal
          isOpen={previewModal.isOpen}
          course={previewModal.course}
          onClose={handleClosePreview}
        />
      )}
    </div>
  );
};

export default Courses;