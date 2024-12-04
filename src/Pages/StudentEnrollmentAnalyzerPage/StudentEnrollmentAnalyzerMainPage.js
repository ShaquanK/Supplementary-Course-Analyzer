import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  Grid,
  Stack,
  TableContainer,
  TextField,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  Typography,
  Box,
  capitalize,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

import DefaultLayout from "../../components/default/layout";
import { collectionAPI } from "../../routes/collection/collection";

import axios from "axios";

function parseTime(time) {
  if (!time || time.length !== 6) return null;

  const hourStr = time.slice(0, 2);
  const minuteStr = time.slice(2, 4);
  const period = time.slice(4); // "AM" or "PM"

  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  if (period === "PM" && hour !== 12) {
    hour += 12;
  }
  if (period === "AM" && hour === 12) {
    hour = 0;
  }

  return hour + minute / 60;
}
const incrementTimeSlot = (startHour, days, timeSlotCounts) => {
  const MWFSlots = {
    "9-10": [9, 10],
    "10-11": [10, 11],
    "11-12": [11, 12],
    "12-1": [12, 13],
    "1-2": [13, 14],
    "2-3": [14, 15],
    "3-4": [15, 16],
  };

  const TRSlots = {
    "9-10:15": [9, 10.25],
    "10:30-11:45": [10.5, 11.75],
    "12-1:15": [12, 13.25],
    "1:30-2:45": [13.5, 14.75],
    "3-4:15": [15, 16.25],
  };

  if (startHour === null) {
    return;
  }

  if (startHour === null) {
    if (days.includes("M") || days.includes("W") || days.includes("F")) {
      timeSlotCounts.MWF["N/A"] = (timeSlotCounts.MWF["N/A"] || 0) + 1;
    }
    if (days.includes("T") || days.includes("R")) {
      timeSlotCounts.TR["N/A"] = (timeSlotCounts.TR["N/A"] || 0) + 1;
    }
    return timeSlotCounts;
  }

  // Check MWF slots
  if (days.includes("M") || days.includes("W") || days.includes("F")) {
    for (const [slot, [start, end]] of Object.entries(MWFSlots)) {
      if (startHour >= start && startHour < end) {
        timeSlotCounts.MWF[slot]++;
        break;
      }
    }
  }

  // Check TR slots
  if (days.includes("T") || days.includes("R")) {
    for (const [slot, [start, end]] of Object.entries(TRSlots)) {
      if (startHour >= start && startHour < end) {
        timeSlotCounts.TR[slot]++;
        break;
      }
    }
  }

  return timeSlotCounts;
};

export const StudentEnrollmentAnalyzerMainPage = () => {
  const [courses, setCourses] = useState([]);
  const [courseNames, setCourseNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState("anth 1");
  const [url, setURL] = useState(
    "https://www.csus.edu/class-schedule/fall-2024/MATH"
  );
  const [filteredCourses, setFilteredCourses] = useState([]);
  const Bio25TimeSlotCounts = [];
  const [timeSlotCounts, setTimeSlotCounts] = useState({
    MWF: {
      "9-10": 0,
      "10-11": 0,
      "11-12": 0,
      "12-1": 0,
      "1-2": 0,
      "2-3": 0,
      "3-4": 0,
      "N/A": 0,
    },
    TR: {
      "9-10:15": 0,
      "10:30-11:45": 0,
      "12-1:15": 0,
      "1:30-2:45": 0,
      "3-4:15": 0,
      "N/A": 0,
    },
  });

  useEffect(() => {
    const fetchCourseNames = async () => {
      setLoading(true);
      const { courseNames } = await collectionAPI.getUniqueCourseNames();
      setCourseNames(courseNames);
      setLoading(false);
    };

    fetchCourseNames();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      handleGetCourses();
    }
  }, [selectedCourse]);

  const handleGetCourses = useCallback(async () => {
    setLoading(true);

    const params = {
      query: selectedCourse,
    };

    try {
      const response = await collectionAPI.getCollection(
        "courses",
        200,
        params
      );

      setCourses(response?.docsArray ?? []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedCourse]);

  useEffect(() => {
    const newTimeSlotCounts = {
      MWF: {
        "9-10": 0,
        "10-11": 0,
        "11-12": 0,
        "12-1": 0,
        "1-2": 0,
        "2-3": 0,
        "3-4": 0,
        "N/A": 0,
      },
      TR: {
        "9-10:15": 0,
        "10:30-11:45": 0,
        "12-1:15": 0,
        "1:30-2:45": 0,
        "3-4:15": 0,
        "N/A": 0,
      },
    };

    if (!courses) return;

    courses?.forEach((courseWithSnapshot) => {
      const course = courseWithSnapshot?.data;
      const startHour = course.start_time ? parseTime(course.start_time) : null;

      const days = course.days?.toUpperCase();

      if (startHour !== null && days) {
        incrementTimeSlot(startHour, days, newTimeSlotCounts);
      } else {
        incrementTimeSlot(null, "N/A", newTimeSlotCounts);
      }
    });

    setTimeSlotCounts(newTimeSlotCounts);
  }, [courses]);

  const handleSetURL = (e) => {
    setURL(e.target.value);
  };
  const handleSyncData = async () => {
    setLoading(true);
    try {
      const headers =
        "Section, Seats, Days, Instructor, StartTime, EndTime, Building";
      const result = await axios.get(
        `http://localhost:5000/scrape?url=${encodeURIComponent(
          url
        )}&headers=${headers}`
      );

      await collectionAPI.syncDataToFirebase(result.data, "Fall", "2024-25");

      const retrievedCourses = await collectionAPI.getCollection("courses");
      setFilteredCourses(retrievedCourses);

      alert("Data synchronized successfully!");
    } catch (error) {
      console.error("Error syncing data:", error);
      alert("Error syncing data. Check the console for more details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitialCourses = async () => {
      setLoading(true);
      try {
        const retrievedCourses = await collectionAPI.getCollection("courses");
        setFilteredCourses(retrievedCourses);
      } catch (error) {
        console.error("Error fetching initial courses:", error);
        setFilteredCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialCourses();
  }, []);

  return (
    <DefaultLayout>
      <Grid container spacing={2} p={1}>
        <Grid item xs={12}>
          <Autocomplete
            disablePortal
            id="course-name-autocomplete"
            options={courseNames}
            loading={loading}
            value={selectedCourse}
            onChange={(event, val) => {
              setSelectedCourse(val);
            }}
            getOptionLabel={(option) => capitalize(option)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select a Course"
                variant="outlined"
                placeholder="Select a Course"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            isOptionEqualToValue={(option, value) => option === value}
            sx={{ width: "100%" }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box component={Paper}>
            <Stack justifyContent="center" alignItems="center" height="100%">
              <Typography variant="subtitle1">
                Monday/Wednesday/Friday Time Slots
              </Typography>
            </Stack>

            <Table size="small">
              <TableBody>
                {Object.entries(timeSlotCounts.MWF).map(
                  ([slot, count], idx) => (
                    <TableRow key={idx}>
                      <TableCell>{slot}</TableCell>
                      <TableCell>{count}</TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box component={Paper}>
            <Stack justifyContent="center" alignItems="center" height="100%">
              <Typography variant="subtitle1">Tuesday/Thursday</Typography>
            </Stack>
            <Table size="small">
              <TableBody>
                {Object.entries(timeSlotCounts.TR).map(([slot, count], idx) => (
                  <TableRow key={idx}>
                    <TableCell>{slot}</TableCell>
                    <TableCell>{count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Grid>
        {courses && <TableContainer></TableContainer>}
      </Grid>
    </DefaultLayout>
  );
};

export default StudentEnrollmentAnalyzerMainPage;
