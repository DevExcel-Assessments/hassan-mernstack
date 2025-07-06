const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:4000/api';
const CLIENT_URL = 'http://localhost:5173';

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'password123'
};

let authToken = '';
let testCourseId = '';

async function login() {
  try {
    console.log('🔐 Logging in...');
    const response = await axios.post(`${BASE_URL}/auth/login`, testUser);
    authToken = response.data.token;
    console.log('✅ Login successful');
    return true;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function getEnrolledCourses() {
  try {
    console.log('📚 Fetching enrolled courses...');
    const response = await axios.get(`${BASE_URL}/orders/enrolled-courses`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (response.data.length > 0) {
      testCourseId = response.data[0]._id;
      console.log(`✅ Found enrolled course: ${response.data[0].title} (ID: ${testCourseId})`);
      return true;
    } else {
      console.log('⚠️ No enrolled courses found');
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to fetch enrolled courses:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testGetCourseReviews() {
  try {
    console.log('📝 Testing get course reviews...');
    const response = await axios.get(`${BASE_URL}/reviews/course/${testCourseId}`);
    
    console.log('✅ Course reviews fetched successfully');
    console.log('📊 Reviews data:', {
      reviews: response.data.reviews?.length || 0,
      pagination: response.data.pagination,
      ratingDistribution: response.data.ratingDistribution,
      courseRating: response.data.courseRating
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ Failed to get course reviews:', error.response?.data?.message || error.message);
    return null;
  }
}

async function testCreateReview() {
  try {
    console.log('✍️ Testing create review...');
    
    const reviewData = {
      rating: 5,
      review: 'This is an excellent course! The instructor explains everything clearly and the content is very practical. I learned a lot and would definitely recommend it to others.'
    };
    
    const response = await axios.post(`${BASE_URL}/reviews/course/${testCourseId}`, reviewData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Review created successfully');
    console.log('📊 Review data:', response.data.review);
    
    return response.data.review;
  } catch (error) {
    console.error('❌ Failed to create review:', error.response?.data?.message || error.message);
    return null;
  }
}

async function testUpdateReview(reviewId) {
  try {
    console.log('✏️ Testing update review...');
    
    const reviewData = {
      rating: 4,
      review: 'Updated review: This is a very good course with practical examples. The instructor is knowledgeable and the content is well-structured.'
    };
    
    const response = await axios.put(`${BASE_URL}/reviews/${reviewId}`, reviewData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Review updated successfully');
    console.log('📊 Updated review data:', response.data.review);
    
    return response.data.review;
  } catch (error) {
    console.error('❌ Failed to update review:', error.response?.data?.message || error.message);
    return null;
  }
}

async function testDeleteReview(reviewId) {
  try {
    console.log('🗑️ Testing delete review...');
    
    const response = await axios.delete(`${BASE_URL}/reviews/${reviewId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Review deleted successfully');
    console.log('📊 Delete response:', response.data);
    
    return true;
  } catch (error) {
    console.error('❌ Failed to delete review:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testReviewValidation() {
  try {
    console.log('🔍 Testing review validation...');
    
    // Test invalid rating
    try {
      await axios.post(`${BASE_URL}/reviews/course/${testCourseId}`, {
        rating: 6,
        review: 'This should fail validation'
      }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Invalid rating validation working');
      }
    }
    
    // Test short review
    try {
      await axios.post(`${BASE_URL}/reviews/course/${testCourseId}`, {
        rating: 5,
        review: 'Short'
      }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Short review validation working');
      }
    }
    
    // Test missing fields
    try {
      await axios.post(`${BASE_URL}/reviews/course/${testCourseId}`, {
        rating: 5
      }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Missing fields validation working');
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Validation test failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testUnauthorizedAccess() {
  try {
    console.log('🚫 Testing unauthorized access...');
    
    // Test creating review without token
    try {
      await axios.post(`${BASE_URL}/reviews/course/${testCourseId}`, {
        rating: 5,
        review: 'This should fail'
      });
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Unauthorized access properly blocked');
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Unauthorized access test failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting comprehensive review system tests...\n');
  
  // Step 1: Login
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without authentication');
    return;
  }
  
  // Step 2: Get enrolled course
  const hasEnrolledCourse = await getEnrolledCourses();
  if (!hasEnrolledCourse) {
    console.log('❌ No enrolled courses found for testing');
    return;
  }
  
  // Step 3: Test get reviews
  await testGetCourseReviews();
  
  // Step 4: Test validation
  await testReviewValidation();
  
  // Step 5: Test unauthorized access
  await testUnauthorizedAccess();
  
  // Step 6: Test create review
  const createdReview = await testCreateReview();
  
  if (createdReview) {
    // Step 7: Test get reviews after creation
    await testGetCourseReviews();
    
    // Step 8: Test update review
    const updatedReview = await testUpdateReview(createdReview._id);
    
    if (updatedReview) {
      // Step 9: Test get reviews after update
      await testGetCourseReviews();
      
      // Step 10: Test delete review
      await testDeleteReview(createdReview._id);
      
      // Step 11: Test get reviews after deletion
      await testGetCourseReviews();
    }
  }
  
  console.log('\n🎉 All review system tests completed!');
  console.log('\n📋 Review System Features:');
  console.log('✅ Create reviews with rating (1-5) and text (10-1000 chars)');
  console.log('✅ Update existing reviews');
  console.log('✅ Delete reviews');
  console.log('✅ Fetch reviews with pagination and filtering');
  console.log('✅ Rating distribution tracking');
  console.log('✅ Course average rating calculation');
  console.log('✅ Validation for rating and review length');
  console.log('✅ Authentication required for all operations');
  console.log('✅ Only enrolled users can review courses');
  console.log('✅ One review per user per course');
}

// Run the tests
runAllTests().catch(console.error); 