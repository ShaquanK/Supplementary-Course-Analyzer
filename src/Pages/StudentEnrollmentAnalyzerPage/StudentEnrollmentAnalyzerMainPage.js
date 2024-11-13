import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Card,
  Box,
  Typography,
  TablePagination,
} from "@mui/material";
import DefaultLayout from "../../components/default/layout";
import { courses } from "../../courses";

// Creates fake student data for testing
function generateStudentEnrollments(numStudents, courses) {
  const students = [];
  for (let i = 1; i <= numStudents; i++) {
    const studentCourses = [];
    const numCourses = Math.floor(Math.random() * 4) + 1;
    while (studentCourses.length < numCourses) {
      const randomCourse = courses[Math.floor(Math.random() * courses.length)];
      if (!studentCourses.includes(randomCourse)) {
        studentCourses.push(randomCourse);
      }
    }
    students.push({ id: i, courses: studentCourses });
  }
  return students;
}

function timeToMinutes(timeRange) {
  const [start, end] = timeRange.split(" - ");
  const [startHour, startMin] = start.split(/[:APM]/).filter(Boolean);
  const [endHour, endMin] = end.split(/[:APM]/).filter(Boolean);
  const isPM = timeRange.includes("PM");

  const startTimeInMinutes =
    (parseInt(startHour) % 12) * 60 + parseInt(startMin) + (isPM ? 720 : 0);
  const endTimeInMinutes =
    (parseInt(endHour) % 12) * 60 + parseInt(endMin) + (isPM ? 720 : 0);

  return { start: startTimeInMinutes, end: endTimeInMinutes };
}

function findFreeTimePerCourse(students, courseId) {
  const timeSlots = new Map();

  students.forEach((student) => {
    const enrolledCourse = student.courses.find(
      (course) => course.course_code === courseId
    );
    if (enrolledCourse) {
      const { days, time } = enrolledCourse;
      const timeRange = timeToMinutes(time);
      if (!timeSlots.has(days)) {
        timeSlots.set(days, []);
      }
      timeSlots.get(days).push(timeRange);
    }
  });

  const possibleTimes = [];
  timeSlots.forEach((times, day) => {
    let freeTimeStart = 480; // Start at 8 AM
    times.sort((a, b) => a.start - b.start);
    for (const time of times) {
      if (time.start > freeTimeStart) {
        possibleTimes.push({ day, start: freeTimeStart, end: time.start });
      }
      freeTimeStart = time.end;
    }
    if (freeTimeStart < 1020) {
      possibleTimes.push({ day, start: freeTimeStart, end: 1020 }); // Until 5 PM
    }
  });

  return possibleTimes;
}

function formatTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const suffix = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours > 12 ? hours - 12 : hours;
  return `${formattedHours}:${mins === 0 ? "00" : mins} ${suffix}`;
}

function StudentEnrollmentAnalyzerMainPage() {
  const [students, setStudents] = useState([]);
  const [courseFreeTimes, setCourseFreeTimes] = useState({});
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const generatedStudents = generateStudentEnrollments(10, courses);
    setStudents(generatedStudents);

    const freeTimes = {};
    courses.forEach((course) => {
      freeTimes[course.course_code] = findFreeTimePerCourse(
        generatedStudents,
        course.course_code
      );
    });
    setCourseFreeTimes(freeTimes);
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <DefaultLayout title="Open Times Based on Student Schedule">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow
              style={{
                backgroundColor: "#333333",
              }}
            >
              <TableCell
                style={{
                  borderRight: "2px solid #E5E4E2",
                  color: "#fff",
                }}
              >
                Course Name
              </TableCell>
              <TableCell
                style={{
                  borderRight: "2px solid #E5E4E2",
                  color: "#fff",
                }}
              >
                Course Section
              </TableCell>
              <TableCell
                style={{
                  borderRight: "2px solid #E5E4E2",
                  color: "#fff",
                }}
              >
                Open Availability
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((course) => (
                <TableRow
                  key={course.course_code}
                  sx={{
                    "&:nth-of-type(even)": { backgroundColor: "#f9f9f9" },
                  }}
                >
                  <TableCell
                    style={{
                      borderRight: "2px solid #E5E4E2",
                    }}
                  >
                    {course.course_title}
                  </TableCell>
                  <TableCell
                    style={{
                      borderRight: "2px solid #E5E4E2",
                    }}
                  >
                    {course.section}
                  </TableCell>
                  <TableCell
                    style={{
                      borderRight: "2px solid #E5E4E2",
                    }}
                  >
                    {courseFreeTimes[course.course_code]?.length > 0 ? (
                      <ul>
                        {courseFreeTimes[course.course_code].map(
                          (slot, index) => (
                            <li key={index}>
                              {slot.day}: {formatTime(slot.start)} -{" "}
                              {formatTime(slot.end)}
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      "No available time slots"
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={courses.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ backgroundColor: (theme) => theme.palette.grey[100] }}
        />
      </TableContainer>
    </DefaultLayout>
  );
}

export default StudentEnrollmentAnalyzerMainPage;
