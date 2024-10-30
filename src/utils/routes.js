import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

//imports from diffrent files
import HomeMainPage from "../Pages/HomePage/HomeMainPage";
import CreatorsMainPage from "../Pages/CreatorsPage/CreatorsMainPage";
import SourceDataMainPage from "../Pages/SourceDataPage/SourceDataMainPage";
import StudentEnrollmentAnalyzerMainPage from "../Pages/StudentEnrollmentAnalyzerPage/StudentEnrollmentAnalyzerMainPage";
import SupCourseAnalyzerMainPage from "../Pages/SupCourseAnalyzer/SupCourseAnalyzerMainPage";
import LoginMainPage from "../Pages/LoginPage/LoginMainPage";
import { Search } from "../Pages/Search/search";
import CourseTimeAnalyzer from "../Pages/CourseTimeAnalyzerPage/CourseTimeAnalyzer";

// route authentication
import ProtectedRoutes from "./ProtectedRoutes";
import { AuthProvider } from "./AuthContext";
import ManageUser from "../Pages/ManageUser/ManageUser";
import Register from "../Pages/RegistrationPage/register";
import UserList from "../Pages/Users";

const RouteProvider = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/Register" element={<Register />} />
          <Route path="/Login" element={<LoginMainPage />} />
          <Route path="/users" element={<UserList />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<HomeMainPage />} />
            <Route
              path="/CourseTimeAnalyzer"
              element={<CourseTimeAnalyzer />}
            />
            <Route path="/Creators" element={<CreatorsMainPage />} />
            <Route path="/SourceData" element={<SourceDataMainPage />} />
            <Route
              path="/StudentEnrollmentAnalyzer"
              element={<StudentEnrollmentAnalyzerMainPage />}
            />
            <Route
              path="/SupCourseAnalyzer"
              element={<SupCourseAnalyzerMainPage />}
            />
            <Route path="/ManageUser" element={<ManageUser />} />
            <Route path="/search" element={<Search />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

// <HashRouter>
//   <Routes>
//     {/* Public Routes */}
//     <Route path="/Register" element={<RegisterMainPage />} />
//     <Route path="/Login" element={<LoginMainPage />} />

//     {/* Protected Routes */}
//     <Route element={<ProtectedRoutes />}>
//       <Route path="/" element={<HomeMainPage />} />
//       <Route
//         path="/CourseTimeAnalyzer"
//         element={<CourseTimeAnalyzer />}
//       />
//       <Route path="/Creators" element={<CreatorsMainPage />} />
//       <Route path="/SourceData" element={<SourceDataMainPage />} />
//       <Route
//         path="/StudentEnrollmentAnalyzer"
//         element={<StudentEnrollmentAnalyzerMainPage />}
//       />
//       <Route
//         path="/SupCourseAnalyzer"
//         element={<SupCourseAnalyzerMainPage />}
//       />
//       <Route path="/ManageUser" element={<ManageUser />} />
//       <Route path="/search" element={<Search />} />
//     </Route>
//   </Routes>
// </HashRouter>;

export default RouteProvider;
