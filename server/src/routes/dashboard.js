import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import getMentorStats from '../controllers/dashboard/mentorStats.js';
import getMentorRecentCourses from '../controllers/dashboard/mentorRecentCourses.js';
import getLearnerStats from '../controllers/dashboard/learnerStats.js';
import getLearnerEnrolledCourses from '../controllers/dashboard/learnerEnrolledCourses.js';
import getRecommendedCourses from '../controllers/dashboard/recommendedCourses.js';
import {
  getRevenueChartData,
  getCoursePerformanceData,
  getEnrollmentTrends,
  getStudentEngagementData
} from '../controllers/dashboard/mentorAnalytics.js';

const router = express.Router();

router.use(authenticate);


router.get('/mentor/stats', authorize('mentor'), getMentorStats);
router.get('/mentor/recent-courses', authorize('mentor'), getMentorRecentCourses);


router.get('/analytics/revenue-chart', authorize('mentor'), getRevenueChartData);
router.get('/analytics/course-performance', authorize('mentor'), getCoursePerformanceData);
router.get('/analytics/enrollment-trends', authorize('mentor'), getEnrollmentTrends);
router.get('/analytics/student-engagement', authorize('mentor'), getStudentEngagementData);


router.get('/learner/stats', authorize('learner'), getLearnerStats);
router.get('/learner/enrolled-courses', authorize('learner'), getLearnerEnrolledCourses);
router.get('/learner/recommended-courses', authorize('learner'), getRecommendedCourses);

export default router; 