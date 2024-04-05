
import './App.css';
import { ThemeProvider } from '@emotion/react';
import { HashRouter, Route, Routes } from 'react-router-dom';

//imports from diffrent files
import HomeMainPage from './Pages/HomePage/HomeMainPage' 
import CourseTimeAnalyzerMainPage from './Pages/CourseTimeAnalyzerPage/CourseTimeAnalyzerMainPage' 
import CreatorsMainPage from './Pages/CreatorsPage/CreatorsMainPage' 
import SourceDataMainPage from './Pages/SourceDataPage/SourceDataMainPage' 
import StudentEnrolmentAnalyzerMainPage from './Pages/StudentEnrolmentAnalyzerPage/StudentEnrolmentAnalyzerMainPage' 
import SupCourseAnalyzerMainPage from './Pages/SupCourseAnalyzer/SupCourseAnalyzerMainPage' 


function App() {
  return (
     <div>
      

      <HashRouter>
      <Routes>
        <Route path="/" element={<HomeMainPage />} />
        <Route path="/CourseTimeAnalyzer" element={<CourseTimeAnalyzerMainPage />} />
        <Route path="/Creators" element={<CreatorsMainPage />} />
        <Route path="/SourceData" element={<SourceDataMainPage />} />
        <Route path="/StudentEnrolmentAnalyzer" element={<StudentEnrolmentAnalyzerMainPage />} />
        <Route path="/SupCourseAnalyzer" element={<SupCourseAnalyzerMainPage />} />

      </Routes>
    </HashRouter>

    </div>
  
  )
}

export default App;