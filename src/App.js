import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import { changeCurrency } from "./redux/currency";
import { Helmet } from "react-helmet";
import Cookies from "js-cookie";
import TeacherAbout from "./pages/teacher/TeacherAbout";
import TeacherPhoto from "./pages/teacher/TeacherPhoto";
import AdminHome from "./pages/admin/AdminHome";
import Subjects from "./pages/admin/Subjects";
import InsertCurriculums from "./pages/admin/InsertCurriculums";
import AdminLogin from "./pages/admin/AdminLogin";
import TeachersApprove from "./pages/admin/TeachersApprove";
import AdditionalInformation from "./pages/teacher/AdditionalInformation";
import TeacherSubjects from "./pages/teacher/TeacherSubjects";
import TeacherResume from "./pages/teacher/TeacherResume";
import TeacherAvailability from "./pages/teacher/TeacherAvailability";
import TeacherDescription from "./pages/teacher/TeacherDescription";
import TeacherVideo from "./pages/teacher/TeacherVideo";
import TeacherSetting from "./pages/teacher/TeacherSetting";
import Login from "./pages/auth/Login";
import StudentFirstStep from "./pages/auth/registerStudent/StudentFirstStep";
import StudentSecondStep from "./pages/auth/registerStudent/StudentSecondStep";
import StudentThirdStep from "./pages/auth/registerStudent/StudentThirdStep";
import StudentFouthStep from "./pages/auth/registerStudent/StudentFouthStep";
import TeacherFirstStep from "./pages/auth/registerTeacher/TeacherFirstStep";
import TeacherSecondStep from "./pages/auth/registerTeacher/TeacherSecondStep";
import TeacherThirdStep from "./pages/auth/registerTeacher/TeacherThirdStep";
import SingleTeacher from "./pages/client/SingleTeacher";
import SearchTeachers from "./pages/client/SearchTeachers";
import StudentProfile from "./pages/student/StudentProfile";
import StudentSettings from "./pages/student/StudentSettings";
import HomeParent from "./pages/parent/HomeParent";
import ParentRegister from "./pages/parent/ParentRegister";
import Home from "./pages/client/Home";
import SearchFilterTeacher from "./pages/client/SearchFilterTeacher";
import AdminLevels from "./pages/admin/AdminLevels";
import AdminClasses from "./pages/admin/AdminClasses";
import AdminCurriculums from "./pages/admin/AdminCurriculums";
import AdminSubjectCategories from "./pages/admin/AdminSubjectCategories";
import AdminParentStudent from "./pages/admin/AdminParentStudent";
import StudentMessages from "./pages/student/StudentMessages";
import StudentPhoto from "./pages/student/StudentPhoto";
import AboutUs from "./pages/client/AboutUs";
import Privacy from "./pages/client/Privacy";
import Terms from "./pages/client/Terms";
import StudentCredit from "./pages/student/StudentCredit";
import AdminBookedLessons from "./pages/admin/AdminBookedLessons";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminTeachers from "./pages/admin/AdminTeachers";
import DetailsBook from "./pages/student/Book/DetailsBook";
import PayNow from "./pages/student/PayNow";
import SuccessCharge from "./pages/student/SuccessCharge";
import FailCharge from "./pages/student/FailCharge";
import StudentPaymentHistory from "./pages/student/StudentPaymentHistory";
import SuccessPayment from "./pages/student/SuccessPayment";
import FailPayment from "./pages/student/FailPayment";
import AdminStduents from "./pages/admin/AdminStduents";
import AdminStudentHistory from "./pages/admin/AdminStudentHistory";
import AdminTeacherDues from "./pages/admin/AdminTeacherDues";
import TeacherSessions from "./pages/teacher/TeacherSessions";
import TeacherNotifications from "./pages/teacher/TeacherNotifications";
import TeacherCredit from "./pages/teacher/TeacherCredit";
import TeacherMessages from "./pages/teacher/TeacherMessages";
import AdminSingleTeacher from "./pages/admin/AdminSingleTeacher";
import MapBrowser from "./pages/client/MapBrowser";
import AdminSocialMedia from "./pages/admin/AdminSocialMedia";
import AdminAddProfit from "./pages/admin/AdminAddProfit";
import ForgetPasswordFirstStep from "./pages/auth/forgetPassword/ForgetPassFirstStep";
import AdminMessages from "./pages/admin/AdminMessages";
import SingleBookedLesson from "./pages/admin/SingleBookedLesson";
import AdminHistory from "./pages/admin/AdminHistory";
import TeacherStudents from "./pages/teacher/TeacherStudents";
import StudentTeachers from "./pages/student/StudentTeachers";
import AdminNewStudent from "./pages/admin/AdminNewStudent";
import AdminNewTeacher from "./pages/admin/AdminNewTeacher";
import AdminEditTeacher from "./pages/admin/AdminEditTeacher";
import AdminEditStudent from "./pages/admin/AdminEditStudent";
import AdminCheckoutRequests from "./pages/admin/AdminCheckoutRequests";
import AdminEditTeacherPhoto from "./pages/admin/AdminEditTeacherPhoto";
import AdminEditTeacherAdditionalInfo from "./pages/admin/AdminEditTeacherAdditionalInfo";
import AdminEditTeacherAvailability from "./pages/admin/AdminEditTeacherAvailability";
import AdminEditTeacherDescription from "./pages/admin/AdminEditTeacherDescription";
import AdminEditTeacherResume from "./pages/admin/AdminEditTeacherResume";
import AdminEditTeacherSubjects from "./pages/admin/AdminEditTeacherSubjects";
import AdminEditTeacherVideo from "./pages/admin/AdminEditTeacherVideo";
import StudentFinancialRecords from "./pages/student/StudentFinancialRecords";
import ForgetPassSecondStep from "./pages/auth/forgetPassword/ForgetPassSecondStep";
import ForgetPassThirdStep from "./pages/auth/forgetPassword/ForgetPassThirdStep";
import StudentNotifications from "./pages/student/StudentNotifications";

// Developer by eng.reem.shwky@gmail.com
import AdminLimeType from "./pages/admin/AdminLimeType";
import AdminTrainingCategoryTypes from "./pages/admin/AdminTrainingCategoryTypes";
import StudentParent from "./pages/student/StudentParent";
import ParentProfile from "./pages/parent/ParentProfile";
import ParentSettings from "./pages/parent/ParentSettings";
import ParentPhoto from "./pages/parent/ParentPhoto";
import ParentChangePassword from "./pages/parent/ParentChangePassword";
import AdminView from "./pages/admin/AdminView";
import TeacherHome from "./pages/teacher/TeacherHome";
import StudentChangePassword from "./pages/student/StudentChangePassword";
import TeacherChangePassword from "./pages/teacher/TeacherChangePassword";
import TeacherCertificates from "./pages/teacher/TeacherCertificates";
import TeacherLectures from "./pages/teacher/TeacherLectures";
import TeacherQuestion from "./pages/teacher/TeacherQuestion";
import TeacherLessons from "./pages/teacher/TeacherLessons";
import TeacherPackage from "./pages/teacher/TeacherPackage";
import SingleCourse from "./pages/client/SingleCourse";
import SingleNews from "./pages/client/SingleNews";
import AdminPackage from "./pages/admin/AdminPackage";
import AdminRate from "./pages/admin/AdminRate";
import SinglePackage from "./pages/client/SinglePackage";
import AdminDrivingLicenses from "./pages/admin/AdminDrivingLicenses";
import AdminSendMail from "./pages/admin/AdminSendMail";
import AdminMailForm from "./pages/admin/AdminMailForm";
import AdminWhatsForm from "./pages/admin/WhatsForm.jsx";
import AdminLecture from "./pages/admin/AdminLecture";
import DrivingLicenses from "./pages/client/DrivingLicenses";
import TeacherQuestionChoose from "./pages/teacher/TeacherQuestionChoose";
import SingleDrivingLicensePage from "./pages/client/SingleDrivingLicensePage";
import AdminCareerDepartment from "./pages/admin/AdminCareerDepartment";
import AdminAdsDepartment from "./pages/admin/AdsDepartment.jsx";
import AdminAdsDepartmentDetails from "./components/admin/ads/Details.jsx";
import AdminCareer from "./pages/admin/AdminCareer";
import SearchCareers from "./pages/client/SearchCareers";
import SingleCareer from "./pages/client/SingleCareer";
import AdminNews from "./pages/admin/AdminNews";
import TeacherTests from "./pages/teacher/TeacherTests";
import AdminTests from "./pages/admin/AdminTests";
import ParentStudentLessons from "./pages/parent/StudentLessons";
import StudentLessons from "./pages/student/StudentLessons";
import ParentStudentProfile from "./pages/parent/StudentProfile";
import AdminExchangeRequest from "./pages/admin/AdminExchangeRequest";
import AdminExchangeRequestsTeachers from "./pages/admin/AdminExchangeRequestsTeachers";
import AdminExchangeRequestsStudents from "./pages/admin/AdminExchangeRequestsStudents";
import AdminExchangeRequestsParents from "./pages/admin/AdminExchangeRequestsParents";
import AdminExchangeRequestsTeachersWaiting from "./pages/admin/AdminExchangeRequestsTeachersWaiting";
import AdminExchangeRequestsParentsWaiting from "./pages/admin/AdminExchangeRequestsParentsWaiting";
import AdminExchangeRequestsStudentsWaiting from "./pages/admin/AdminExchangeRequestsStudentsWaiting";
import AdminDiscount from "./pages/admin/AdminDiscount";
import AdminAds from "./pages/admin/AdminAds";
import BookTest from "./pages/student/Book/BookTest";
import BookLecture from "./pages/student/Book/BookLecture";
import StudentTests from "./pages/student/StudentTests";
import StudentLectures from "./pages/student/StudentLectures";
import TeacherDiscounts from "./pages/teacher/TeacherDiscounts";
import AdminCashBox from "./pages/admin/AdminCashBox";
import AdminStudentViewDetails from "./components/admin/cashbox/StudentViewDetails";
import AdminTeacherViewDetails from "./components/admin/cashbox/TeacherViewDetails";
import BookPackage from "./pages/student/Book/BookPackage";
import StudentPackages from "./pages/student/StudentPackages";
import AdminRefundStudent from "./components/admin/ExchangeRequestStudents/RefundAdd";
import AdminPefundTeacher from "./components/admin/ExchangeRequestTeachers/RefundAdd";
import StudentRefund from "./pages/student/StudentRefund";
import TeacherRefund from "./pages/teacher/TeacherRefund";
import Discounts from "./pages/client/Discounts";
import SingleDiscount from "./pages/client/SingleDiscount";
import SingleAds from "./pages/client/SingleAds";
import GuestFirstStep from "./pages/auth/registerGuest/GuestFirstStep";
import GuestSecondStep from "./pages/auth/registerGuest/GuestSecondStep";
import GuestThreeStep from "./pages/auth/registerGuest/GuestThreeStep";
import GuestLogin from "./pages/auth/registerGuest/GuestLogin";
import GuestPorfile from "./pages/guest/Profile.jsx";
import GuestPhoto from "./pages/guest/Photo.jsx";
import GuestCareer from "./pages/guest/Career.jsx";
import GuestAdsStepOne from "./pages/guest/ads/StepOne";
import GuestAdsStepTwo from "./pages/guest/ads/StepTwo.jsx";
import GuestAdsStepThree from "./pages/guest/ads/StepThree.jsx";
import GuestAdsStepFour from "./pages/guest/ads/StepFour";
import GuestAdsStepDetails from "./pages/guest/ads/Details.jsx";
import GuestMainBox from "./pages/guest/MainBox.jsx";
import GuestCareerADD from "./pages/guest/CareerADD.jsx";
import GuestAds from "./pages/guest/Ads.jsx";
import BookDiscount from "./pages/student/Book/BookDiscount.jsx";
import StudentDiscounts from "./pages/student/StudentDiscounts.jsx";
import GuestCareerStepOne from "./pages/guest/career/StepOne.jsx";
import GuestCareerStepTwo from "./pages/guest/career/StepTwo.jsx";
import GuestCareerDetails from "./pages/guest/career/Details.jsx";
import AdminTeachersAccount from "./pages/admin/AdminTeachersAccount.jsx";
import TermsTeacher from "./pages/client/TermsTeacher.jsx";
import UnderDevelopmentStudent from "./components/UnderDevelopmentStudent.jsx";
import UnderDevelopment from "./components/UnderDevelopment.jsx";
import NotFound from "./components/NotFound.jsx";
import InteractiveSystemInfo from "./pages/client/InteractiveSystemInfo";
import Test from "./components/client/home/Test.jsx";
import SingleTest from "./components/client/home/SingleTest.jsx";
import ReferralSystem from "./components/teacher/ReferralSystem.jsx";
import RequestLesson from "./components/teacher/Lesson/RequestLesson.jsx";
import MyBillsTeacher from "./components/teacher/MyBills.jsx";
import TeacherLectureUpdate from "./components/teacher/lecture/TeacherLectureUpdate.jsx";
import EditPackage from "./pages/teacher/EditPackage.jsx";
import EditExam from "./pages/teacher/EditExam.jsx";
import EditDiscount from "./components/teacher/discounts/UpdateDicount.jsx";
import SearchTest from "./test/searchTest";
import TechnicalSupport from "./pages/student/TechnicalSupport.jsx";
import TeacherDashboard from "./components/teacher/TeacherDashboard.jsx";
import StudentDashboard from "./components/student/StudentDashboard.jsx";
import CustomerComplaints from "./pages/admin/CustomerComplaints.jsx";
import ReplyComplaint from "./pages/admin/ReplyComplaint.jsx";
import AdminCounts from "./pages/admin/AdminCounts.jsx";
import StudentLesson from "./pages/student/StudentLesson.jsx";
import PayLesson from "./pages/student/PayLesson.jsx";
import AdminRequestLesson from "./pages/admin/AdminRequestLesson.jsx";
import StudentPackage from "./pages/student/StudentPackage.jsx";
import StudentLecture from "./pages/student/StudentLecture.jsx";
import StudentQuestion from "./pages/student/StudentQuestion.jsx";
import StudentExam from "./pages/student/StudentExam.jsx";
import StudentDiscount from "./pages/student/StudentDiscount.jsx";

const theme = createTheme({
  direction: "rtl",
  palette: {
    primary: {
      main: "#800000",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#FFC93C",
      contrastText: "#ffffff",
    },
    Gray: {
      main: "#F6F6F6",
      contrastText: "#6D6D6D",
    },
    Blue: {
      main: "#ffffff33",
      contrastText: "#ffffff",
    },
  },
});

function App() {
  const dispatch = useDispatch();
  const queryClient = new QueryClient();
  const [title, setTitle] = useState("Muscat Driving School");
  useEffect(() => {
    const lang = Cookies.get("i18next") || "en";
    if (lang === "ar") {
      document.body.dir = "rtl";
      setTitle("مسقط لتعليم قيادة السيارات");
    } else {
      document.body.dir = "ltr";
    }
  }, []);

  const { admin } = useSelector((state) => state.admin);
  const { teacher } = useSelector((state) => state.teacher);
  const { parent } = useSelector((state) => state.parent);
  const { student } = useSelector((state) => state.student);
  const { guest } = useSelector((state) => state.guest);
  const { currency } = useSelector((state) => state.currency);

  useEffect(() => {
    async function getCurrency() {
      const response = await fetch(`https://ipapi.co/json/`);
      const data = await response.json();
      dispatch(changeCurrency({ currency: data?.currency }));
    }
    if (!currency) {
      getCurrency();
    }
  }, []);

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>{title}</title>
      </Helmet>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <Routes>
            {/** client pages */}
            <Route path="/" element={<Home />} />
            {/* <Route path="/searchtest" element={<SearchTest />} /> */}
            <Route path="/landing" element={<SearchTest />} />
            <Route path="teachers/search" element={<SearchTeachers />} />
            <Route path="teacher/:id" element={<SingleTeacher />} />
            <Route path="course/:id" element={<SingleCourse />} />
            <Route path="package/:id" element={<SinglePackage />} />
            <Route path="driving-details/:id" element={<SingleDrivingLicensePage />} />
            <Route path="/filter/:subjectId" element={<SearchFilterTeacher />} />
            <Route path="about-us" element={<AboutUs />} />
            <Route path="PrivacyPolicy" element={<Privacy />} />
            <Route path="TermsAndConditions" element={<Terms />} />
            <Route path="driving-licenses" element={<DrivingLicenses />} />
            <Route path="discounts" element={<Discounts />} />
            <Route path="discount-details/:id" element={<SingleDiscount />} />
            <Route path="ads-details/:AdsId" element={<SingleAds />} />

            <Route path="careers" element={<SearchCareers />} />
            <Route path="career-details/:id" element={<SingleCareer />} />
            <Route path="news-details/:id" element={<SingleNews />} />

            <Route path="map-browser" element={student ? <MapBrowser /> : <Navigate to="/" />} />
            <Route path="ractiveSystemInfo" element={<InteractiveSystemInfo />} />
            <Route path="resource" element={<UnderDevelopment />} />
            <Route path="exames" element={<Test />} />
            <Route path="test/:id/:testId" element={<SingleTest />} />
            <Route path="*" element={<NotFound />} />

            {/** login page */}
            <Route path="login" element={<Login />} />
            {/** guest auth */}
            <Route path="guestRegister/step1" element={<GuestFirstStep />} />
            <Route path="guestRegister/step2/:type" element={<GuestSecondStep />} />
            <Route path="guestRegister/step3/:type" element={<GuestThreeStep />} />

            <Route path="loginGuest" element={<GuestLogin />} />
            <Route path="guest/profile" element={<GuestPorfile />} />
            <Route path="guest/photo" element={<GuestPhoto />} />
            <Route path="guest/careers" element={<GuestCareer />} />
            <Route path="guest/create-career" element={<GuestCareerADD />} />
            <Route path="guest/create-career/step1" element={<GuestCareerStepOne />} />
            <Route path="guest/create-career/step2/:CareerId" element={<GuestCareerStepTwo />} />
            <Route path="guest/career/details/:CareerId" element={<GuestCareerDetails />} />

            <Route path="guest/create-ads/step1" element={<GuestAdsStepOne />} />
            <Route path="guest/create-ads/step2/:AdsId" element={<GuestAdsStepTwo />} />
            <Route path="guest/create-ads/step3/:AdsId" element={<GuestAdsStepThree />} />
            <Route path="guest/create-ads/step4/:AdsId" element={<GuestAdsStepFour />} />
            <Route path="guest/ads/details/:AdsId" element={<GuestAdsStepDetails />} />
            <Route path="guest/ads" element={<GuestAds />} />
            <Route path="guest/main" element={<GuestMainBox />} />
            <Route path="guest" element={<UnderDevelopment />} />
            <Route path="Terms-Conditions-teacher" element={<TermsTeacher />} />

            {/** student auth */}
            <Route path="studentregister/step1" element={<StudentFirstStep />} />
            <Route path="studentregister/step2" element={<StudentSecondStep />} />
            <Route path="studentregister/step3" element={<StudentThirdStep />} />
            <Route path="studentregister/step4" element={<StudentFouthStep />} />

            {/** teacher auth */}
            <Route path="teacherRegister/step1" element={<TeacherFirstStep />} />
            <Route path="teacherRegister/step2" element={<TeacherSecondStep />} />
            <Route path="teacherRegister/step3" element={<TeacherThirdStep />} />
            <Route path="forgetPassword/step1" element={<ForgetPasswordFirstStep />} />
            <Route path="forgetPassword/step2" element={<ForgetPassSecondStep />} />
            <Route path="forgetPassword/step3" element={<ForgetPassThirdStep />} />
            {/** student pages */}
            <Route path="student/profile" element={student ? <StudentProfile /> : <Navigate to="/login" />} />
            <Route path="student/referral-system" element={student ? <UnderDevelopmentStudent /> : <Navigate to="/login" />} />
            <Route path="student/request-lesson" element={student ? <StudentLesson /> : <Navigate to="/login" />} />
            <Route path="student/package" element={student ? <StudentPackage /> : <Navigate to="/login" />} />
            <Route path="student/questions" element={student ? <StudentQuestion /> : <Navigate to="/login" />} />
            <Route path="student/exam" element={student ? <StudentExam /> : <Navigate to="/login" />} />
            <Route path="student/discount" element={student ? <StudentDiscount /> : <Navigate to="/login" />} />
            <Route path="student/technical-support" element={student ? <TechnicalSupport /> : <Navigate to="/login" />} />
            <Route path="student/mybills" element={student ? <UnderDevelopmentStudent /> : <Navigate to="/login" />} />
             <Route
              path="student/payLesson/:id"
              element={student ? <PayLesson /> : <Navigate to="/login" />}
            />
            <Route
              path="student/dashboard"
              element={student ? <StudentDashboard /> : <Navigate to="/login" />}
            />
            <Route path="student/settings" element={student ? <StudentSettings /> : <Navigate to="/login" />} />
            <Route path="student/parents" element={student ? <StudentParent /> : <Navigate to="/login" />} />
            <Route path="student/changepassword" element={student ? <StudentChangePassword /> : <Navigate to="/login" />} />
            <Route path="/student/messages" element={student ? <StudentMessages /> : <Navigate to="/login" />} />
            <Route path="/student/lessons" element={student ? <StudentLessons /> : <Navigate to="/login" />} />
            <Route path="/student/profile_photo" element={student ? <StudentPhoto /> : <Navigate to="/login" />} />
            <Route path="/student/credit" element={student ? <StudentCredit /> : <Navigate to="/login" />} />
            <Route path="/student/refunds" element={student ? <StudentRefund /> : <Navigate to="/login" />} />

            <Route
              path="/book/:teacherId"
              element={student ? <DetailsBook /> : <Navigate to="/login" />}
            />

            <Route
              path="/book-test/:testId"
              element={student ? <BookTest /> : <Navigate to="/login" />}
            />

            <Route
              path="/book-lecture/:lectureId"
              element={student ? <BookLecture /> : <Navigate to="/login" />}
            />

            <Route
              path="/book-package/:packageId"
              element={student ? <BookPackage /> : <Navigate to="/login" />}
            />
            <Route
              path="/student/lecture"
              element={student ? <StudentLecture /> : <Navigate to="/login" />}
            />
            <Route
              path="/book-discount/:discountId"
              element={student ? <BookDiscount /> : <Navigate to="/login" />}
            />

            <Route
              path="/pay-now"
              element={student ? <PayNow /> : <Navigate to="/login" />}
            />

            <Route
              path="/student/payment-history"
              element={student ? <StudentPaymentHistory /> : <Navigate to="/login" />}
            />

            <Route
              path="/student/tests"
              element={student ? <StudentTests /> : <Navigate to="/login" />}
            />

            <Route path="/student/lectures" element={student ? <StudentLectures /> : <Navigate to="/login" />} />
            <Route path="/student/packages" element={student ? <StudentPackages /> : <Navigate to="/login" />} />
            <Route path="/student/discounts" element={student ? <StudentDiscounts /> : <Navigate to="/login" />} />
            <Route path="/student/financial-records" element={student ? <StudentFinancialRecords /> : <Navigate to="/login" />} />
            <Route path="/student/teachers" element={student ? <StudentTeachers /> : <Navigate to="/login" />} />
            <Route path="student/notifications" element={student ? <StudentNotifications /> : <Navigate to="/login" />} />
            {/** teacher pages */}
            <Route
              path="teacher"
              element={teacher ? <TeacherHome /> : <Navigate to="/login" />}
            />

            <Route
              path="teacher/changepassword"
              element={teacher ? <TeacherChangePassword /> : <Navigate to="/login" />}
            />

            <Route
              path="teacher/about"
              element={teacher ? <TeacherAbout /> : <Navigate to="/login" />}
            />
            <Route
              path="teacher/dashboard"
              element={teacher ? <TeacherDashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="teacher/mybills"
              element={teacher ? <MyBillsTeacher /> : <Navigate to="/login" />}
            />
            <Route
              path="teacher/request-lesson"
              element={teacher ? <RequestLesson /> : <Navigate to="/login" />}
            />
            <Route
              path="teacher/pointsearned"
              element={teacher ? <ReferralSystem /> : <Navigate to="/login" />}
            />

            <Route
              path="teacher/photo"
              element={teacher ? <TeacherPhoto /> : <Navigate to="/login" />}
            />

            <Route
              path="teacher/additionalInformation"
              element={teacher ? <AdditionalInformation /> : <Navigate to="/login" />}
            />

            <Route
              path="teacher/subjects"
              element={teacher ? <TeacherSubjects /> : <Navigate to="/login" />}
            />

            <Route
              path="teacher/resume"
              element={teacher ? <TeacherResume /> : <Navigate to="/login" />}
            />

            <Route
              path="teacher/availability"
              element={teacher ? <TeacherAvailability /> : <Navigate to="/login" />}
            />
            <Route path="teacher/description" element={teacher ? <TeacherDescription /> : <Navigate to="/login" />} />
            <Route path="teacher/video" element={teacher ? <TeacherVideo /> : <Navigate to="/login" />} />
            <Route path="teacher/settings" element={teacher ? <TeacherSetting /> : <Navigate to="/login" />} />
            <Route path="teacher/messages" element={teacher ? <TeacherMessages /> : <Navigate to="/login" />} />
            <Route
              path="teacher/refunds"
              element={teacher ? <TeacherRefund /> : <Navigate to="/login" />}
            />

            <Route
              path="teacher/sessions"
              element={teacher ? <TeacherSessions /> : <Navigate to="/login" />}
            />

            <Route
              path="teacher/discounts"
              element={teacher ? <TeacherDiscounts /> : <Navigate to="/login" />}
            />
            <Route
              path="teacher/edit-discount/:id"
              element={teacher ? <EditDiscount /> : <Navigate to="/login" />}
            />

            <Route
              path="teacher/lessons"
              element={teacher ? <TeacherLessons /> : <Navigate to="/login" />}
            />

            <Route
              path="teacher/tests"
              element={teacher ? <TeacherTests /> : <Navigate to="/login" />}
            />
           <Route
              path="teacher/editExam/:id"
              element={teacher ? <EditExam /> : <Navigate to="/login" />}
            />
            <Route
              path="teacher/notifications"
              element={
                teacher ? <TeacherNotifications /> : <Navigate to="/login" />
              }
            />

            <Route
              path="teacher/lectures"
              element={teacher ? <TeacherLectures /> : <Navigate to="/login" />}
            />
            <Route
              path="teacher/lectures/:id"
              element={teacher ? <TeacherLectureUpdate /> : <Navigate to="/login" />}
            />
            <Route
              path="teacher/credit"
              element={teacher ? <TeacherCredit /> : <Navigate to="/login" />}
            />

            <Route
              path="teacher/students"
              element={teacher ? <TeacherStudents /> : <Navigate to="/login" />}
            />

            <Route
              path="teacher/certificates"
              element={teacher ? <TeacherCertificates /> : <Navigate to="/login" />}
            />


            <Route
              path="teacher/package"
              element={teacher ? <TeacherPackage /> : <Navigate to="/login" />}
            />
            <Route
              path="teacher/edit-package/:id"
              element={teacher ? <EditPackage /> : <Navigate to="/login" />}
            />
            <Route
              path="teacher/question"
              element={teacher ? <TeacherQuestion /> : <Navigate to="/login" />}
            />

            <Route
              path="teacher/question-choose"
              element={teacher ? <TeacherQuestionChoose /> : <Navigate to="/login" />}
            />


            {/** admin pages */}
            <Route
              path="admin/login"
              element={!admin ? <AdminLogin /> : <Navigate to="/admin" />}
            />
            <Route
              path="admin"
              element={admin ? <AdminHome /> : <Navigate to="/admin/login" />}
            />
            <Route
              path="admin/levels"
              element={admin ? <AdminLevels /> : <Navigate to="/admin/login" />}
            />
            <Route
              path="admin/years"
              element={
                admin ? <AdminClasses /> : <Navigate to="/admin/login" />
              }
            />
            <Route
              path="admin/curriculums"
              element={
                admin ? <AdminCurriculums /> : <Navigate to="/admin/login" />
              }
            />
            <Route
              path="admin/complaints"
              element={
                admin ? <CustomerComplaints /> : <Navigate to="/admin/login" />
              }
            />
            <Route
              path="admin/reply-complaint/:messageId/:studentId"
              element={
                admin ? <ReplyComplaint /> : <Navigate to="/admin/login" />
              }
            />
            <Route
              path="admin/counts"
              element={admin ? <AdminCounts /> : <Navigate to="/admin" />}
            />
            <Route
              path="admin/trainingcategorytypes"
              element={
                admin ? <AdminTrainingCategoryTypes /> : <Navigate to="/admin/login" />
              }
            />

            <Route
              path="admin/limetype"
              element={admin ? <AdminLimeType /> : <Navigate to="/admin/login" />}
            /><Route
              path="admin/request-lesson"
              element={admin ? <AdminRequestLesson /> : <Navigate to="/admin/login" />}
            />
            <Route
              path="admin/subjects"
              element={admin ? <Subjects /> : <Navigate to="/admin/login" />}
            />
            <Route
              path="admin/categories"
              element={
                admin ? (
                  <AdminSubjectCategories />
                ) : (
                  <Navigate to="/admin/login" />
                )
              }
            />
            <Route
              path="admin/Curriculums_insert"
              element={
                admin ? <InsertCurriculums /> : <Navigate to="/admin/login" />
              }
            />
            <Route
              path="admin/teachers_approve"
              element={
                admin ? <TeachersApprove /> : <Navigate to="/admin/login" />
              }
            />
            <Route
              path="admin/parent-student"
              element={admin ? <AdminParentStudent /> : <Navigate to="/admin/login" />}
            />
            <Route
              path="admin/package"
              element={admin ? <AdminPackage /> : <Navigate to="/admin/login" />}
            />

            <Route
              path="admin/booked-lessons"
              element={
                admin ? <AdminBookedLessons /> : <Navigate to="/admin/login" />
              }
            />

            <Route
              path="admin/payments"
              element={
                admin ? <AdminPayments /> : <Navigate to="/admin/login" />
              }
            />

            <Route path="admin/teachers" element={admin ? <AdminTeachers /> : <Navigate to="/admin/login" />} />
            <Route path="admin/students" element={admin ? <AdminStduents /> : <Navigate to="/admin/login" />} />

            <Route
              path="admin/social-media"
              element={
                admin ? <AdminSocialMedia /> : <Navigate to="/admin/login" />
              }
            />

            <Route
              path="admin/add-profit"
              element={
                admin ? <AdminAddProfit /> : <Navigate to="/admin/login" />
              }
            />
            <Route path="admin/student/:id/payment" element={admin ? <AdminStudentHistory /> : <Navigate to="/admin/login" />} />
            <Route path="admin/teacher/:id/dues" element={admin ? <AdminTeacherDues /> : <Navigate to="/admin/login" />} />
            <Route path="admin/teachers-account-statment" element={admin ? <AdminTeachersAccount /> : <Navigate to="/admin/login" />} />
            <Route path="admin/teacher/:teacherId" element={admin ? <AdminSingleTeacher /> : <Navigate to="/admin/login" />} />
            <Route path="admin/messages" element={admin ? <AdminMessages /> : <Navigate to="/admin/login" />} />
            <Route path="admin/history" element={admin ? <AdminHistory /> : <Navigate to="/admin/login" />} />
            <Route path="admin/booked-lesson/:bookedLessonId" element={admin ? <SingleBookedLesson /> : <Navigate to="/admin/login" />} />
            <Route path="admin/new/student" element={admin ? <AdminNewStudent /> : <Navigate to="/admin/login" />} />
            <Route path="admin/new/teacher" element={admin ? <AdminNewTeacher /> : <Navigate to="/admin/login" />} />
            <Route
              path="admin/edit/student/:studentId"
              element={
                admin ? <AdminEditStudent /> : <Navigate to="/admin/login" />
              }
            />
            <Route
              path="admin/edit/teacher/:teacherId"
              element={
                admin ? <AdminEditTeacher /> : <Navigate to="/admin/login" />
              }
            />
            <Route
              path="admin/edit/teacher/photo/:teacherId"
              element={
                admin ? (
                  <AdminEditTeacherPhoto />
                ) : (
                  <Navigate to="/admin/login" />
                )
              }
            />
            <Route
              path="admin/edit/teacher/additionalInformation/:teacherId"
              element={
                admin ? (
                  <AdminEditTeacherAdditionalInfo />
                ) : (
                  <Navigate to="/admin/login" />
                )
              }
            />
            <Route
              path="admin/edit/teacher/availability/:teacherId"
              element={
                admin ? (
                  <AdminEditTeacherAvailability />
                ) : (
                  <Navigate to="/admin/login" />
                )
              }
            />
            <Route
              path="admin/edit/teacher/description/:teacherId"
              element={
                admin ? (
                  <AdminEditTeacherDescription />
                ) : (
                  <Navigate to="/admin/login" />
                )
              }
            />
            <Route
              path="admin/edit/teacher/resume/:teacherId"
              element={
                admin ? (
                  <AdminEditTeacherResume />
                ) : (
                  <Navigate to="/admin/login" />
                )
              }
            />
            <Route
              path="admin/edit/teacher/subjects/:teacherId"
              element={
                admin ? (
                  <AdminEditTeacherSubjects />
                ) : (
                  <Navigate to="/admin/login" />
                )
              }
            />

            <Route
              path="admin/edit/teacher/video/:teacherId"
              element={admin ? (<AdminEditTeacherVideo />) : (<Navigate to="/admin/login" />)}
            />

            <Route
              path="admin/checkout-requests"
              element={admin ? (<AdminCheckoutRequests />) : (<Navigate to="/admin/login" />)}
            />

            <Route
              path="admin/admin-view"
              element={admin ? <AdminView /> : <Navigate to="/admin/login" />}
            />

            <Route
              path="admin/rate"
              element={admin ? <AdminRate /> : <Navigate to="/admin/login" />}
            />

            <Route
              path="admin/driving"
              element={admin ? <AdminDrivingLicenses /> : <Navigate to="/admin/login" />}
            />

            <Route
              path="admin/send-mail"
              element={admin ? <AdminSendMail /> : <Navigate to="/admin/login" />}
            />

            <Route
              path="admin/lectures"
              element={admin ? <AdminLecture /> : <Navigate to="/admin/login" />}
            />


            <Route
              path="admin/ads-department"
              element={admin ? <AdminAdsDepartment /> : <Navigate to="/admin/login" />}
            />

            <Route
              path="admin/career-department"
              element={admin ? <AdminCareerDepartment /> : <Navigate to="/admin/login" />}
            />

            <Route
              path="admin/career"
              element={admin ? <AdminCareer /> : <Navigate to="/admin/login" />}
            />

            <Route
              path="admin/career/waiting"
              element={admin ? <AdminCareer /> : <Navigate to="/admin/login" />}
            />

            <Route
              path="admin/news"
              element={admin ? <AdminNews /> : <Navigate to="/admin/login" />}
            />

            <Route
              path="admin/tests"
              element={admin ? <AdminTests /> : <Navigate to="/admin/login" />}
            />

            <Route
              path="admin/exchange-requests"
              element={admin ? <AdminExchangeRequest /> : <Navigate to="/admin/login" />}
            />

            <Route
              path="admin/exchange-request-teachers"
              element={admin ? <AdminExchangeRequestsTeachers /> : <Navigate to="/admin/login" />}
            />

            <Route
              path="admin/exchange-request-teachers/waiting"
              element={admin ? <AdminExchangeRequestsTeachersWaiting /> : <Navigate to="/admin/login" />}
            />

            <Route
              path="admin/refund-teacher/:exchangeRequestTeacherId"
              element={admin ? <AdminPefundTeacher /> : <Navigate to="/admin/login" />}
            />

            <Route
              path="admin/refund-student/:exchangeRequestStudentId"
              element={admin ? <AdminRefundStudent /> : <Navigate to="/admin/login" />}
            />

            <Route
              path="admin/exchange-request-students"
              element={admin ? <AdminExchangeRequestsStudents /> : <Navigate to="/admin/login" />}
            />

            <Route
              path="admin/exchange-request-students/waiting"
              element={admin ? <AdminExchangeRequestsStudentsWaiting /> : <Navigate to="/admin/login" />}
            />

            <Route
              path="admin/exchange-request-parents"
              element={admin ? <AdminExchangeRequestsParents /> : <Navigate to="/admin/login" />}
            />

            <Route
              path="admin/exchange-request-parents/waiting"
              element={admin ? <AdminExchangeRequestsParentsWaiting /> : <Navigate to="/admin/login" />}
            />

            <Route
              path="admin/ads"
              element={admin ? <AdminAds /> : <Navigate to="/admin/login" />}
            />

            <Route
              path="admin/ads/waiting"
              element={admin ? <AdminAds /> : <Navigate to="/admin/login" />}
            />
            <Route
              path="admin/ads/details/:AdsId"
              element={admin ? <AdminAdsDepartmentDetails /> : <Navigate to="/admin/login" />}
            />

            <Route
              path="admin/discounts"
              element={admin ? <AdminDiscount /> : <Navigate to="/admin/login" />}
            />

            <Route path="admin/mail-form/:mail" element={admin ? <AdminMailForm /> : <Navigate to="/admin/login" />} />
            <Route path="admin/whatsapp-form/:phone" element={admin ? <AdminWhatsForm /> : <Navigate to="/admin/login" />} />

            <Route path="admin/cash-box" element={admin ? <AdminCashBox /> : <Navigate to="/admin/login" />} />

            <Route
              path="admin/details-financial-records/:studentId"
              element={admin ? <AdminStudentViewDetails /> : <Navigate to="/admin/login" />}
            />

            <Route
              path="admin/teacher-financial-records/:teacherId"
              element={admin ? <AdminTeacherViewDetails /> : <Navigate to="/admin/login" />}
            />




            {/** parent pages */}
            <Route path="parent/register" element={<ParentRegister />} />
            <Route path="parent" element={parent ? <HomeParent /> : <Navigate to="/" />} />
            <Route path="parent/profile" element={parent ? <ParentProfile /> : <Navigate to="/" />} />
            <Route path="parent/settings" element={parent ? <ParentSettings /> : <Navigate to="/" />} />
            <Route path="parent/profile_photo" element={parent ? <ParentPhoto /> : <Navigate to="/" />} />
            <Route path="parent/changepassword" element={parent ? <ParentChangePassword /> : <Navigate to="/" />} />
            <Route path="parent/student/:id" element={parent ? <ParentStudentProfile /> : <Navigate to="/" />} />
            <Route path="parent/student-lessons/:id" element={parent ? <ParentStudentLessons /> : <Navigate to="/" />} />

            {/** success and fail pages */}
            <Route path="/success-charge" element={<SuccessCharge />} />
            <Route path="/fail-charge" element={<FailCharge />} />
            <Route path="/success-payment" element={<SuccessPayment />} />
            <Route path="/fail-payment" element={<FailPayment />} />
            <Route />
          </Routes>
        </ThemeProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
