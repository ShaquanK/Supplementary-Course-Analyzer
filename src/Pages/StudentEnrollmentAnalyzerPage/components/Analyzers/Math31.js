import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  Card,
  Grid,
  Stack,
  TableContainer,
  TablePagination,
  TextField,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Button,
  Accordion,
  Paper,
  AccordionSummary,
  AccordionDetails,
  Typography,
  InputAdornment,
  IconButton,
  Box,
  MenuItem,
  Select,
} from "@mui/material";
import uniq from "lodash/uniq";
import CircularProgress from "@mui/material/CircularProgress";

import SearchIcon from "@mui/icons-material/Search";

import { collectionAPI } from "../../../../routes/collection/collection";

import { ExpandMore } from "@mui/icons-material";
import axios from "axios";

const useGetCourses = (params) => {
  const [courses, setCourses] = useState([]);

  const handleGetCourses = useCallback(async () => {
    const retrievedCourses = await collectionAPI.getCollection("courses");

    setCourses(retrievedCourses);
  }, []);

  useEffect(() => {
    handleGetCourses();
  }, []);

  return courses;
};

// Function to parse time in "HHMMAM/PM" format
function parseTime(time) {
  if (!time || time.length !== 6) return null; // Ensure time is not empty and has correct length

  const hourStr = time.slice(0, 2);
  const minuteStr = time.slice(2, 4);
  const period = time.slice(4); // "AM" or "PM"

  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  // Adjust hour for PM times
  if (period === "PM" && hour !== 12) {
    hour += 12;
  }
  // Adjust hour for midnight (12 AM should be 0)
  if (period === "AM" && hour === 12) {
    hour = 0;
  }

  return hour + minute / 60; // Convert to a decimal format for easier comparison
}

export const useMath31TimeSlotCounts = () => {
  const [courses, setCourses] = useState([]);
  const [timeSlotCounts, setTimeSlotCounts] = useState({
    MWF: {
      "9-10": 0,
      "10-11": 0,
      "11-12": 0,
      "12-1": 0,
      "1-2": 0,
      "2-3": 0,
      "3-4": 0,
    },
    TR: {
      "9-10:15": 0,
      "10:30-11:45": 0,
      "12-1:15": 0,
      "1:30-2:45": 0,
      "3-4:15": 0,
    },
  });



  useEffect(() => {
    const handleGetCourses = async () => {
      const retrievedCourses = await collectionAPI.getCollection("courses");
      setCourses(retrievedCourses);
    };

    handleGetCourses();
  }, []);


// Step 3: Categorize courses by time slots
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
    },
    TR: {
      "9-10:15": 0,
      "10:30-11:45": 0,
      "12-1:15": 0,
      "1:30-2:45": 0,
      "3-4:15": 0,
    },
  };

  courses
  .filter((course) => course.course_name?.toLowerCase().match(/\bmath 31\b/))
  .forEach((course) => {
    const startHour = parseTime(course.start_time);
    const days = course.days?.toUpperCase();
    if (startHour !== null && days) {
      if (days.includes("M") || days.includes("W") || days.includes("F")) {
        if (startHour >= 9 && startHour < 10) {
          newTimeSlotCounts.MWF["9-10"]++;
        } else if (startHour >= 10 && startHour < 11) {
          newTimeSlotCounts.MWF["10-11"]++;
        } else if (startHour >= 11 && startHour < 12) {
          newTimeSlotCounts.MWF["11-12"]++;
        } else if (startHour >= 12 && startHour < 13) {
          newTimeSlotCounts.MWF["12-1"]++;
        } else if (startHour >= 13 && startHour < 14) {
          newTimeSlotCounts.MWF["1-2"]++;
        } else if (startHour >= 14 && startHour < 15) {
          newTimeSlotCounts.MWF["2-3"]++;
        } else if (startHour >= 15 && startHour < 16) {
          newTimeSlotCounts.MWF["3-4"]++;
        }
      } else if (days.includes("T") || days.includes("R")) {
        if (startHour >= 9 && startHour < 10.25) {
          newTimeSlotCounts.TR["9-10:15"]++;
        } else if (startHour >= 10.5 && startHour < 11.75) {
          newTimeSlotCounts.TR["10:30-11:45"]++;
        } else if (startHour >= 12 && startHour < 13.25) {
          newTimeSlotCounts.TR["12-1:15"]++;
        } else if (startHour >= 13.5 && startHour < 14.75) {
          newTimeSlotCounts.TR["1:30-2:45"]++;
        } else if (startHour >= 15 && startHour < 16.25) {
          newTimeSlotCounts.TR["3-4:15"]++;
        }
      }
    }
  });

  setTimeSlotCounts(newTimeSlotCounts);
}, [courses]);

return timeSlotCounts;
};
