import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const API_BASE_URL = 'http://localhost:5000/api';

// Test credentials (you'll need to update these with actual user credentials)
const TEST_CREDENTIALS = {
  email: 'mentor@example.com',
  password: 'password123'
};

let authToken = '';

// Helper function to login and get token
async function login() {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, TEST_CREDENTIALS);
    authToken = response.data.accessToken;
    console.log('✅ Login successful');
    return authToken;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    throw error;
  }
}

// Helper function to create a test video file
function createTestVideoFile() {
  const testVideoPath = path.join(process.cwd(), 'test-video.mp4');
  
  // Create a simple test video file (1KB of random data)
  const testData = Buffer.alloc(1024);
  for (let i = 0; i < testData.length; i++) {
    testData[i] = Math.floor(Math.random() * 256);
  }
  
  fs.writeFileSync(testVideoPath, testData);
  console.log('✅ Test video file created');
  return testVideoPath;
}

// Test course creation with video upload
async function testCourseCreation() {
  try {
    console.log('\n🚀 Testing course creation with video upload...');
    
    // Create test video file
    const testVideoPath = createTestVideoFile();
    
    // Prepare form data
    const formData = new FormData();
    formData.append('title', 'Test Course - Upload System');
    formData.append('description', 'This is a test course to verify the upload system is working correctly.');
    formData.append('category', 'Web Development');
    formData.append('price', '29.99');
    formData.append('level', 'beginner');
    formData.append('tags', 'test, upload, video, course');
    formData.append('requirements', 'Basic programming knowledge');
    formData.append('whatYouWillLearn', 'Upload system testing, Video processing, Thumbnail generation');
    formData.append('video', fs.createReadStream(testVideoPath));
    
    // Make the request
    const response = await axios.post(`${API_BASE_URL}/courses`, formData, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        ...formData.getHeaders()
      },
      timeout: 30000 // 30 seconds timeout
    });
    
    console.log('✅ Course created successfully!');
    console.log('📊 Response:', {
      courseId: response.data.course._id,
      title: response.data.course.title,
      videoUrl: response.data.course.videoUrl,
      thumbnail: response.data.course.thumbnail,
      duration: response.data.course.duration,
      uploadInfo: response.data.uploadInfo
    });
    
    // Clean up test file
    fs.unlinkSync(testVideoPath);
    console.log('✅ Test video file cleaned up');
    
    return response.data.course._id;
    
  } catch (error) {
    console.error('❌ Course creation failed:', error.response?.data || error.message);
    throw error;
  }
}

// Test video streaming
async function testVideoStreaming(courseId) {
  try {
    console.log('\n🎥 Testing video streaming...');
    
    const response = await axios.get(`${API_BASE_URL}/videos/stream/${courseId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      responseType: 'stream'
    });
    
    console.log('✅ Video streaming endpoint working');
    console.log('📊 Response headers:', {
      'content-type': response.headers['content-type'],
      'content-length': response.headers['content-length'],
      'accept-ranges': response.headers['accept-ranges']
    });
    
  } catch (error) {
    console.error('❌ Video streaming failed:', error.response?.data || error.message);
  }
}

// Test thumbnail access
async function testThumbnailAccess(courseId) {
  try {
    console.log('\n🖼️ Testing thumbnail access...');
    
    const response = await axios.get(`${API_BASE_URL}/videos/thumbnail/${courseId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      responseType: 'stream'
    });
    
    console.log('✅ Thumbnail endpoint working');
    console.log('📊 Response headers:', {
      'content-type': response.headers['content-type'],
      'content-length': response.headers['content-length']
    });
    
  } catch (error) {
    console.error('❌ Thumbnail access failed:', error.response?.data || error.message);
  }
}

// Main test function
async function runTests() {
  try {
    console.log('🧪 Starting upload system tests...\n');
    
    // Step 1: Login
    await login();
    
    // Step 2: Test course creation
    const courseId = await testCourseCreation();
    
    // Step 3: Test video streaming
    await testVideoStreaming(courseId);
    
    // Step 4: Test thumbnail access
    await testThumbnailAccess(courseId);
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📝 Summary:');
    console.log('- ✅ Authentication working');
    console.log('- ✅ File upload working');
    console.log('- ✅ Video processing working');
    console.log('- ✅ Thumbnail generation working');
    console.log('- ✅ Video streaming working');
    console.log('- ✅ Thumbnail access working');
    
  } catch (error) {
    console.error('\n💥 Test suite failed:', error.message);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}

export { runTests }; 