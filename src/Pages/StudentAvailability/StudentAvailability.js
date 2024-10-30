import React, { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
} from 'firebase/firestore';
import { db } from "../../utils/firebase";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  InputLabel,
  FormControl,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import DefaultLayout from "../../components/default/layout";

function StudentAvailability() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [newCourse, setNewCourse] = useState('');
  const [studentName, setStudentName] = useState('');
  const [errorMessage, setErrorMessage] = useState([]);
  const [days, setDays] = useState({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
  });
  const [timeSlots, setTimeSlots] = useState([
    { startTime: '', endTime: '' },
  ]);
  const [availabilityData, setAvailabilityData] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesCollection = collection(db, 'coursesPAL');
        const snapshot = await getDocs(coursesCollection);
        const coursesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    if (!selectedCourse) return;

    const fetchAvailability = async () => {
      try {
        const q = query(
          collection(db, 'studentAvailability'),
          where('courseId', '==', selectedCourse)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => doc.data());
        setAvailabilityData(data);
      } catch (error) {
        console.error('Error fetching availability data:', error);
      }
    };

    fetchAvailability();
  }, [selectedCourse]);

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  const handleAddCourse = async () => {
    if (newCourse.trim() === '') return;
    try {
      const docRef = await addDoc(collection(db, 'coursesPAL'), { name: newCourse });
      setCourses([...courses, { id: docRef.id, name: newCourse }]);
      setSelectedCourse(docRef.id);
      setNewCourse('');
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const handleDayChange = (event) => {
    setDays({ ...days, [event.target.name]: event.target.checked });
  };

  const handleTimeSlotChange = (index, field, value) => {
    const newTimeSlots = [...timeSlots];
    newTimeSlots[index][field] = value;
    setTimeSlots(newTimeSlots);
  };

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, { startTime: '', endTime: '' }]);
  };

  const handleSubmit = async () => {
    if (!selectedCourse) return;

    let errors = [];

    // Check Student Name
    if (!studentName.trim()) {
      errors.push("Please enter the student's name.");
    }

    // Check Selected Days
    const selectedDays = Object.keys(days).filter(day => days[day]);
    if (selectedDays.length === 0) {
      errors.push('Please select at least one day.');
    }

    // Check Time Slots
    const incompleteTimeSlots = timeSlots.some(
      slot => !slot.startTime || !slot.endTime
    );
    if (incompleteTimeSlots) {
      errors.push('Please fill in all time slots.');
    }

    // Check for Errors
    if (errors.length > 0) {
      setErrorMessage(errors);
      return;
    }

    // Clear any existing error messages
    setErrorMessage([]);

    const availability = {
      studentName,
      days: selectedDays,
      timeSlots,
      courseId: selectedCourse,
    };

    try {
      await addDoc(collection(db, 'studentAvailability'), availability);

      // Reset form
      setStudentName('');
      setDays({
        Monday: false,
        Tuesday: false,
        Wednesday: false,
        Thursday: false,
        Friday: false,
      });
      setTimeSlots([{ startTime: '', endTime: '' }]);

      // Refresh availability data
      const q = query(
        collection(db, 'studentAvailability'),
        where('courseId', '==', selectedCourse)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => doc.data());
      setAvailabilityData(data);
    } catch (error) {
      console.error('Error submitting availability:', error);
    }
  };

  // Formatting military time to AM/PM
  const formatTime = (timeStr) => {
    const [hourStr, minuteStr] = timeStr.split(':');
    let hour = parseInt(hourStr, 10);
    const minute = minuteStr;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12; 
    return `${hour}:${minute} ${ampm}`;
  };

  return (
    <DefaultLayout>
      <Box padding={2}>
        <Box marginBottom={4}>
          <Typography variant="h5">Select or Add a Course</Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel id="course-select-label">Course</InputLabel>
            <Select
              labelId="course-select-label"
              value={selectedCourse}
              onChange={handleCourseChange}
              label="Course"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {courses.map(course => (
                <MenuItem key={course.id} value={course.id}>
                  {course.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box display="flex" alignItems="center">
            <TextField
              label="New Course"
              value={newCourse}
              onChange={(e) => setNewCourse(e.target.value)}
              variant="outlined"
              margin="normal"
              fullWidth
            />
            <Button
              onClick={handleAddCourse}
              variant="contained"
              color="primary"
              style={{ marginLeft: 16, height: 56 }}
            >
              Add Course
            </Button>
          </Box>
        </Box>

        {selectedCourse && (
          <Box marginBottom={4}>
            <Typography variant="h5">Enter Student Availability</Typography>
            {errorMessage.length > 0 && (
              <Box marginBottom={2}>
                  <Typography color="error" variant="h6" style={{ fontWeight: 'bold', 
                    fontSize: '1.2rem', backgroundColor: '#fdd', padding: '8px', borderRadius: '4px' }}>
                  Please fix the following errors:
                </Typography>
                <List dense>
                    {errorMessage.map((error, index) => (
                        <ListItem key={index}>
                        <ListItemText
                            primary={error}
                            primaryTypographyProps={{ style: { fontSize: '1.1rem', fontWeight: 'bold' } }}
                        />
                        </ListItem>
                    ))}
                    </List>
                </Box>
                )}

            <TextField
              label="Student Name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              variant="outlined"
              margin="normal"
              fullWidth
            />
            <Box marginY={2}>
              <Typography variant="subtitle1">Select Days</Typography>
              <Box display="flex" flexWrap="wrap">
                {Object.keys(days).map(day => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={days[day]}
                        onChange={handleDayChange}
                        name={day}
                      />
                    }
                    label={day}
                    key={day}
                  />
                ))}
              </Box>
            </Box>
            <Box marginY={2}>
              <Typography variant="subtitle1">Time Slots</Typography>
              {timeSlots.map((slot, index) => (
                <Box key={index} display="flex" alignItems="center" marginBottom={1}>
                  <TextField
                    label="Start Time"
                    type="time"
                    value={slot.startTime}
                    onChange={(e) => handleTimeSlotChange(index, 'startTime', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ step: 300 }}
                    variant="outlined"
                    margin="normal"
                    style={{ marginRight: 16 }}
                  />
                  <TextField
                    label="End Time"
                    type="time"
                    value={slot.endTime}
                    onChange={(e) => handleTimeSlotChange(index, 'endTime', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ step: 300 }}
                    variant="outlined"
                    margin="normal"
                  />
                </Box>
              ))}
              <Button onClick={addTimeSlot} variant="outlined" color="primary">
                Add Time Slot
              </Button>
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              style={{ marginTop: 16 }}
            >
              Submit Availability
            </Button>
          </Box>
        )}

        {selectedCourse && (
          <Box>
            <Typography variant="h5">Student Availability</Typography>
            {availabilityData.map((availability, index) => (
              <Box key={index} border={1} padding={2} marginY={2}>
                <Typography variant="h6">{availability.studentName}</Typography>
                <Typography variant="subtitle1">
                  Days: {availability.days.join(', ')}
                </Typography>
                <Typography variant="subtitle1">Time Slots:</Typography>
                {availability.timeSlots.map((slot, idx) => (
                  <Typography key={idx}>
                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                  </Typography>
                ))}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </DefaultLayout>
  );
}

export default StudentAvailability;
