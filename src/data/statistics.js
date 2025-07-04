// src/data/statistics.js

export const stats = {
  student: {
    lessons: 12,
    completedLessons: 10,
    lecturesAttended: 4,
    examsTaken: 2,
    progress: 75,
    totalPayments: 2000,
    discountsUsed: 3,
    lessonsChart: [
      { date: "01/06", lessons: 1 },
      { date: "02/06", lessons: 2 },
      { date: "03/06", lessons: 1 },
      { date: "04/06", lessons: 6 },
      { date: "05/06", lessons: 8 },
      { date: "06/06", lessons: 9 },
      { date: "07/06", lessons: 4 },
      { date: "08/06", lessons: 3 },
      { date: "09/06", lessons: 5 },
      { date: "10/06", lessons: 6 },
      { date: "11/06", lessons: 8 },
      { date: "12/06", lessons: 2 },
    ],
    // إضافات داخل stats.student
progressHistory: [
  { date: "01/06", progress: 20 },
  { date: "02/06", progress: 40 },
  { date: "03/06", progress: 60 },
  { date: "04/06", progress: 60 },
  { date: "05/06", progress: 60 },
  { date: "06/06", progress: 60 },
  { date: "07/06", progress: 60 },
  { date: "08/06", progress: 60 },
  { date: "09/06", progress: 60 },
  { date: "10/06", progress: 60 },
  { date: "11/06", progress: 60 },
  { date: "12/06", progress: 75 },
],
bookingsByType: [
  { name: "درس", value: 5 },
  { name: "باقة", value: 3 },
  { name: "اختبار", value: 2 },
  { name: "خصومات", value: 2 },
],
lessonsByInstructor: [
  { name: "مدرب أحمد", value: 4 },
  { name: "مدرب سارة", value: 6 },
  { name: "مدرب خالد", value: 2 },
],

  },

  instructor: {
    totalLessonsTaught: 150,
    totalStudentsTaught: 80,
    totalLecturesGiven: 20,
    averageRating: 4.6,
    examsSupervised: 10,
    scheduledThisWeek: 8,
    lessonsChart: [
      { date: "01/06", lessons: 3 },
      { date: "02/06", lessons: 5 },
      { date: "03/06", lessons: 4 },
      { date: "04/06", lessons: 6 },
      { date: "05/06", lessons: 8 },
      { date: "06/06", lessons: 9 },
      { date: "07/06", lessons: 4 },
      { date: "08/06", lessons: 3 },
      { date: "09/06", lessons: 5 },
      { date: "10/06", lessons: 6 },
      { date: "11/06", lessons: 8 },
      { date: "12/06", lessons: 2 },
    ],
  },

  admin: {
    totalUsers: 500,
    totalStudents: 350,
    totalInstructors: 30,
    totalBookings: 1200,
    revenuePerMonth: [
      { month: "يناير", revenue: 5000 },
      { month: "فبراير", revenue: 7000 },
      { month: "فبراير", revenue: 7000 },
      { month: "فبراير", revenue: 7000 },
      { month: "فبراير", revenue: 7000 },
      { month: "فبراير", revenue: 7000 },
      { month: "فبراير", revenue: 7000 },
      { month: "فبراير", revenue: 7000 },
      { month: "فبراير", revenue: 7000 },
      { month: "فبراير", revenue: 7000 },
      { month: "فبراير", revenue: 7000 },
      { month: "فبراير", revenue: 7000 },
    ],
    bookingsByType: [
      { name: "دروس", value: 450 },
      { name: "باقة", value: 300 },
      { name: "خصم", value: 150 },
      { name: "اختبار", value: 180 },
      { name: "محاضرة", value: 120 },
    ],
  },
};
