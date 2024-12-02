import React, { useState } from "react";
import {
  Box,
  Card,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import { parseTime } from "../utils/parse-time";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const columns = [
  { key: "M", label: "Monday" },
  { key: "T", label: "Tuesday" },
  { key: "W", label: "Wednesday" },
  { key: "H", label: "Thursday" },
  { key: "R", label: "Friday" },
];

const parseCourseTime = (time) => {
  const [timePart, period] = time.split(" ");
  const [hour, minute] = timePart.split(":");

  let hourNum = parseInt(hour, 10);
  const minuteNum = parseInt(minute, 10);

  if (period === "PM" && hourNum < 12) {
    hourNum += 12;
  } else if (period === "AM" && hourNum === 12) {
    hourNum = 0;
  }

  return hourNum * 60 + minuteNum;
};

const generateHours = () => {
  const hours = [];
  for (let i = 6; i <= 21; i++) {
    let hour12 = i % 12 === 0 ? 12 : i % 12;
    let period = i < 12 ? "AM" : "PM";
    hours.push({ hour: hour12, period: period });
  }
  return hours;
};

export const CalendarView = ({ courses }) => {
  const [open, setOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [matchedCourses, setMatchedCourses] = useState([]);
  const hours = generateHours();

  const getMatchedCourse = (day, hour) => {
    const matchedCourses = courses.filter((courseDoc) => {
      let days = [];
      let i = 0;
      let course = courseDoc?.data;

      const startTime = parseTime(course?.start_time);
      const endTime = parseTime(course?.end_time);

      while (i < course?.days?.length) {
        if (
          course?.days[i] === "T" &&
          i + 1 < course?.days?.length &&
          course?.days[i + 1] === "H"
        ) {
          days.push("T");
          i += 2; // Skip the 'H'
        } else if (course?.days[i] === "T") {
          days.push("T");
          i += 1;
        } else {
          days.push(course?.days[i]);
          i += 1;
        }
      }
      let startHour = parseCourseTime(startTime);
      let endHour = parseCourseTime(endTime);
      const isDayMatched = days?.includes(day.key);
      const hourToCheck = hour * 60;

      return isDayMatched && hourToCheck >= startHour && hourToCheck < endHour;
    });
    return matchedCourses;
  };

  const handleCellClick = (day, hour) => {
    const matchedCourses = getMatchedCourse(day, hour.hour);
    setMatchedCourses(matchedCourses);
    setSelectedTime(`${hour.hour}:00 ${hour.period} ${day.label}`);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setMatchedCourses([]);
  };

  return (
    <>
      <Card style={{ border: "1px solid #d1d5db" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              {columns.map((day) => (
                <TableCell key={day.key} id={day.key} align="center">
                  <strong>{day.label}</strong>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {hours.map((hour) => (
              <TableRow key={`${hour.hour}-${hour.period}`}>
                <TableCell
                  id={`${hour.hour}:00 ${hour.period}`}
                  component="th"
                  scope="row"
                  align="center"
                >
                  {`${hour.hour}:00 ${hour.period}`}
                </TableCell>

                {columns.map((day) => {
                  const matchedCourses = getMatchedCourse(day, hour.hour);
                  return (
                    <TableCell
                      key={`${hour.hour}-${day.key}`}
                      id={`${hour.hour}-${day.key}`}
                      align="center"
                      onClick={() => handleCellClick(day, hour)}
                    >
                      {matchedCourses?.length ? (
                        <Box
                          id={`${hour.hour}-${day.key}-match`}
                          className="view-courses-button"
                          sx={{
                            fontWeight: 600,
                            borderRadius: "5px",
                            cursor: "pointer",
                            backgroundColor: "rgba(34, 197, 94, 0.8)",
                            color: "white",
                            textAlign: "center",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            "&:hover": {
                              transition: ".35s ease",
                              backgroundColor: (theme) =>
                                theme.palette.primary.dark,
                            },
                          }}
                          minHeight={30}
                          minWidth="100%"
                        >
                          View Course(s)
                        </Box>
                      ) : (
                        <Box minHeight={30}>-</Box>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <Dialog open={open} onClose={handleClose} id="course-match-dialog">
        <DialogTitle>Courses at {selectedTime}</DialogTitle>
        <DialogContent>
          {matchedCourses.length > 0 ? (
            <Box>
              {matchedCourses.map((course, index) => (
                <Box
                  key={`${course?.data?.name}-${course?.data?.section}`}
                  id={course?.data?.name}
                  sx={{ marginBottom: 2 }}
                >
                  <Card sx={{ padding: 2, backgroundColor: "#f5f5f5" }}>
                    <Box sx={{ fontWeight: "bold" }}>{course?.data?.name}</Box>
                    <Box>Instructor: {course?.data?.instructor}</Box>
                    <Box>
                      Time: {parseTime(course?.data?.start_time)} -{" "}
                      {parseTime(course?.data?.end_time)}
                    </Box>
                  </Card>
                </Box>
              ))}
            </Box>
          ) : (
            <Box>No courses available at this time.</Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} id="close-modal-button" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
