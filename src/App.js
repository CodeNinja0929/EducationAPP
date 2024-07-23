import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./context/PrivateRoute";

import HomeTwo from "./Components/Home/HomeTwo";
import AboutOne from "./Components/Pages/AboutOne";
import BLogStandard from "./Components/Pages/BLogStandard";
import ContactUs from "./Components/Pages/ContactUs";
import Courses from "./Components/Pages/Courses";
import ErrorPage from "./Components/Pages/404Page";
import RegisterPage from "./Components/Auth/Register";
import LoginPage from "./Components/Auth/Login";
import AITeacherInputPage from "./Components/Courses/AITeacherInputPage";
import CourseOutlinePage from "./Components/Courses/CourseOutlinePage";
import FinalViewPage from "./Components/Courses/FinalViewPage";
import CourseContentPage from "./Components/Courses/CourseContentPage";
import ExamPage from "./Components/Courses/ExamPage";
import GenerateVideoCourse from "./Components/Courses/GenerateVideoCourse";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="font-gilroy font-medium text-gray text-lg leading-[27px]">
          <Routes>
            <Route path="/" element={<Navigate to={"/schoolai/home"} />} />
            <Route path="/schoolai/register" element={<RegisterPage />} />
            <Route path="/schoolai/login" element={<LoginPage />} />
            <Route path="/schoolai/home" element={<HomeTwo />} />
            <Route path="/schoolai/" element={<HomeTwo />} />
            <Route path="/schoolai/about" element={<AboutOne />} />
            <Route path="/schoolai/courses" element={<PrivateRoute element={<Courses />} />} />
            <Route path="/schoolai/new-course" element={<PrivateRoute element={<AITeacherInputPage />} />} />
            <Route path="/schoolai/courseoutline" element={<PrivateRoute element={<CourseOutlinePage />} />} />
            <Route path="/schoolai/finalview" element={<PrivateRoute element={<FinalViewPage />} />} />
            <Route path="/schoolai/coursecontent" element={<PrivateRoute element={<CourseContentPage />} />} />
            <Route path="/schoolai/exam" element={<PrivateRoute element={<ExamPage />} />} />
            <Route path="/schoolai/generatevideo" element={<PrivateRoute element={<GenerateVideoCourse />} />} />
            <Route path="/schoolai/blog-standard" element={<BLogStandard />} />
            <Route path="/schoolai/contacts" element={<ContactUs />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
