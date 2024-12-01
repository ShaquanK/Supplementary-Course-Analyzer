import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

//imports from diffrent files
import HomeMainPage from "../Pages/HomePage/HomeMainPage";
import CreatorsMainPage from "../Pages/CreatorsPage/CreatorsMainPage";
import StudentEnrollmentAnalyzerMainPage from "../Pages/StudentEnrollmentAnalyzerPage/StudentEnrollmentAnalyzerMainPage";
import LoginMainPage from "../Pages/LoginPage/LoginMainPage";
import { Search } from "../Pages/Search/search";
import StudentAvailability from "../Pages/StudentAvailability/StudentAvailability";

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

            <Route path="/Creators" element={<CreatorsMainPage />} />
            <Route
              path="/StudentEnrollmentAnalyzer"
              element={<StudentEnrollmentAnalyzerMainPage />}
            />
            <Route path="/ManageUser" element={<ManageUser />} />
            <Route path="/search" element={<Search />} />
            <Route
              path="/StudentAvailability"
              element={<StudentAvailability />}
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default RouteProvider;
