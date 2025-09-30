import { createRoot } from 'react-dom/client';
import { lazy } from 'react';
import './index.css';
import App from './App.jsx';
import { Provider } from 'react-redux';
import store from './redux/store.js';
import { Route, RouterProvider, createRoutesFromElements } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';
import PrivateRoute from './pages/User/PrivateRoute.jsx';
import AdminRoute from './pages/Admin/AdminRoute.jsx';
import CreateResume from './pages/Auth/CreateResume.jsx';
import Category from './pages/Admin/Category.jsx';
import Resume from './pages/Admin/Resume.jsx';
import ForgotPassword from './pages/Auth/ForgotPassword.jsx';
import Profile from './pages/Auth/Profile.jsx';
import Contact from './pages/User/Contact.jsx';
import NonSchengenJobsPage from './pages/User/Non-Schengen.jsx';
import StudentVisaPage from './pages/User/StudentVisaPage.jsx';
import SchengenWorkPermitsPage from './pages/User/SchengenWorkPermits.jsx';

import AboutUs from './pages/User/AboutUs.jsx';
import Jobs from './pages/User/Jobs.jsx';
import CreateJob from './pages/Admin/CreateJob.jsx';
import JobDetail from './pages/Auth/job.jsx';
import BlogDetail from './pages/User/BlogDetail.jsx';
import AdminUsers from './pages/Admin/AdminUsers.jsx';
import AdminJob from './pages/Admin/AdminJob.jsx';
import UpdateJob from './pages/Admin/UpdateJob.jsx';
import AdminBlog from './pages/Admin/AdminBlog.jsx';
import AdminResume from './pages/Admin/AdminResume.jsx';
import AdminMessage from './pages/Admin/AdminMessae.jsx';
import CreateTestimonial from './pages/Admin/CreateTestimonial.jsx';
import Testimonials from './pages/User/Testimonials.jsx';
import AdminJobSubmit from './pages/Admin/AdminJobSubmit.jsx';
import ApplicationData from './pages/Admin/AplicationData.jsx';
import AboutCountry from './pages/User/AboutCountry.jsx';
import CreateAboutCountry from './pages/Admin/CreateAboutCountry.jsx';
import AboutTheCountry from './pages/User/AboutTheCountry.jsx';
import AdminAboutCountrys from './pages/Admin/AdminAboutCountrys.jsx';
import UpdateCountry from './pages/Admin/UpdateCountry.jsx';
import CreateLanguageCourses from './pages/Admin/CreateLanguageCourses.jsx';
import CoursesPage from './pages/User/CouresePage.jsx';
import TheLanguageCourses from './pages/User/TheLanguageCourses.jsx';
import UpdateLanguageCourse from './pages/Admin/UpdateLanguageCourse.jsx';
import AdminLanguageCourses from './pages/Admin/AdminLanguageCourses.jsx';
import UpdateTestimonial from './pages/Auth/UpdateTestimonial.jsx';
import AsianJobsPage from './pages/User/AsianCountries.jsx';
import MyResume from './pages/Auth/MyResume.jsx';
import AdminTeam from './pages/Admin/AminTeam.jsx';
import CreateTeam from './pages/Admin/CreateTeam.jsx';
import UpdateTeam from './pages/Admin/UpdateTeam.jsx';
import SuccessStory from './pages/User/SuccessStory.jsx';
import UpdateMyResume from './pages/Auth/UpdateMyResume.jsx';
import AdminTestimonial from './pages/Admin/AdminTestimonial.jsx';
import TestimonialById from './pages/Admin/TestimonialById.jsx';
import UpdateTestimonialById from './pages/Admin/UpdateTestimonialById.jsx';
import AdminEnroll from './pages/Admin/AdminEnroll.jsx';
import ErrorPage from './pages/User/FakeError.jsx';
const UpdateBlog = lazy(() => import('./pages/Admin/UpdateBlog.jsx'));
const Dashboard = lazy(() => import('./pages/Admin/Dashboard.jsx'));
const CreateBlog = lazy(() => import('./pages/Admin/CreateBlog.jsx'));
const Home = lazy(() => import('./pages/User/Home.jsx'));
const LoginUser = lazy(() => import('./pages/Auth/LoginUser.jsx'));
const Register = lazy(() => import('./pages/Auth/Register.jsx'));
const EmailVerify = lazy(() => import('./pages/Auth/EmailVerify.jsx'));
const Blogs = lazy(() => import('./pages/User/Blogs.jsx'));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<Home />} />
      <Route path='/login' element={<LoginUser />} />
      <Route path='register' element={<Register />} />
      <Route path='/verify' element={<EmailVerify />} />
      <Route path='/blogs' element={<Blogs />} />
      <Route path='/blog/:id' element={<BlogDetail />} />
      <Route path='/forgot-password' element={<ForgotPassword />} />
      <Route path='/contact' element={<Contact />} />
      <Route path='/services/non-schengen' element={<NonSchengenJobsPage />} />
      <Route path='/services/student-visa' element={<StudentVisaPage />} />
      <Route path='/services/schengen' element={<SchengenWorkPermitsPage />} />
      <Route path='/services/countrys' element={<AboutCountry />} />
      <Route path='/services/asian' element={<AsianJobsPage />} />
      <Route path='/about' element={<AboutUs />} />
      <Route path='/jobs' element={<Jobs />} />
      <Route path='/jobs/:id' element={<JobDetail />} />
      <Route path='/testimonials' element={<Testimonials />} />
      <Route path='/country/:id' element={<AboutTheCountry />} />
      <Route path='/LanguageCourses' element={<CoursesPage />} />
      <Route path='/courses/:id' element={<TheLanguageCourses />} />
      <Route path='success-story/:id' element={<SuccessStory />} />

      <Route path='' element={<PrivateRoute />}>
        <Route path='/createResume' element={<CreateResume />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/update-MyResume' element={<UpdateMyResume/>}/>
        <Route path='/myResume' element={<MyResume />} />
        <Route path='create-testimonial' element={<CreateTestimonial />} />
        <Route path='update-testimonial' element={<UpdateTestimonial />} />
        <Route path='/admin' element={<AdminRoute />}>
          <Route path='resume/:id' element={<Resume />} />
          <Route path='category' element={<Category />} />
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='createblog' element={<CreateBlog />} />
          <Route path='updateblog/:id' element={<UpdateBlog />} />
          <Route path='users' element={<AdminUsers />} />
          <Route path='createjob' element={<CreateJob />} />
          <Route path='job' element={<AdminJob />} />
          <Route path='job/:id' element={<UpdateJob />} />
          <Route path='blogs' element={<AdminBlog />} />
          <Route path='resumes' element={<AdminResume />} />
          <Route path='messages' element={<AdminMessage />} />
          <Route path='applications' element={<AdminJobSubmit />} />
          <Route path='job-applications/:id' element={<ApplicationData />} />
          <Route path='create-AboutCountry' element={<CreateAboutCountry />} />
          <Route path='aboutCountrys' element={<AdminAboutCountrys />} />
          <Route path='updateCountry/:id' element={<UpdateCountry />} />
          <Route
            path='create-language-course'
            element={<CreateLanguageCourses />}
          />
          <Route
            path='language-course/:id'
            element={<UpdateLanguageCourse />}
          />
          <Route path='language-course' element={<AdminLanguageCourses />} />
          <Route path='team' element={<AdminTeam />} />
          <Route path='create-team' element={<CreateTeam />} />
          <Route path='team/:id' element={<UpdateTeam />} />
          <Route path='testimonial' element={<AdminTestimonial />} />
          <Route path='testimonial/:id' element={<TestimonialById />} />
          <Route path='testimonial/:id/edit' element={<UpdateTestimonialById/>}/>
          <Route path='language-enroll' element={<AdminEnroll/>}/>
        </Route>
      </Route>
      <Route path='*' element={<ErrorPage/>}/>
    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

window.addEventListener('load', () => {
  const loader = document.getElementById('preloader');
  if (loader) {
    loader.remove();
  }
});