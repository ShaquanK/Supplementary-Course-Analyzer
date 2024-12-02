import React, { useCallback, useEffect, useState } from "react";

import {
  Grid,
  TableContainer,
  TablePagination,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  InputAdornment,
  IconButton,
  Switch,
  FormControlLabel,
  useMediaQuery,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import SearchIcon from "@mui/icons-material/Search";
import DefaultLayout from "../../components/default/layout";
import { collectionAPI } from "../../routes/collection/collection";
import { parseTime } from "../../utils/parse-time";
import { ExpandMore } from "@mui/icons-material";
import axios from "axios";
import { FilterModal } from "./components/FilterModal";
import { CalendarView } from "../../components/CalendarView";

export const Search = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [section, setSection] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [lastVisible, setLastVisible] = useState(null);
  const [firstVisible, setFirstVisible] = useState(null);
  const [showAvail, setShowAvail] = useState(false);
  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);
  const [isCalendarView, setIsCalendarView] = useState(false);
  const [filterCount, setFilterCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [url, setURL] = useState(
    "https://www.csus.edu/class-schedule/fall-2024/MATH"
  );

  const mdUp = useMediaQuery((theme) => theme.breakpoints.up("sm"));

  const headers =
    "Section, Seats, Days, Instructor, StartTime, EndTime, Building";

  const handleGetCourses = useCallback(async () => {
    setLoading(true);

    const params = {
      query: query,
      section: section,
      startTime: startTime,
      endTime: endTime,
      showAvail: showAvail,
      lastVisible: lastVisible,
      firstVisible: firstVisible,
    };

    try {
      const response = await collectionAPI.getCollection(
        "courses",
        rowsPerPage,
        params
      );

      setCourses(response?.docsArray ?? []);

      setLastVisible(response?.lastVisible ?? null);
      setFirstVisible(response?.docsArray[0]?.snapshot ?? null);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  }, [
    rowsPerPage,
    lastVisible,
    firstVisible,
    query,
    startTime,
    endTime,
    section,
    showAvail,
  ]);

  useEffect(() => {
    setCourses([]);
    setLoading(true);
    handleGetCourses();
  }, [page, rowsPerPage]);

  useEffect(() => {
    setLastVisible(null);
    const count = [query, section, startTime, endTime].filter(
      (value) => value !== null && value !== undefined && value !== ""
    ).length;

    setFilterCount(count);
  }, [query, section, startTime, endTime]);

  const handleSyncData = async () => {
    setLoading(true);
    try {
      const result = await axios(
        `http://localhost:5000/scrape?url=${encodeURIComponent(
          url
        )}&headers=${headers}`
      );
      setData(result.data);

      await collectionAPI.syncDataToFirebase(result?.data, "Fall", "2024-25");
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    if (newPage > page) {
      setLastVisible(courses[courses.length - 1]?.snapshot);
    } else if (newPage < page) {
      setLastVisible(firstVisible?.snapshot);
    }
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = +event.target.value;
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleSetURL = (e) => setURL(e.target.value);

  const handleOpenFilterModal = () => setShowFilterModal(true);

  const handleCloseFilterModal = () => setShowFilterModal(false);

  const handleSetSection = (val) => {
    setSection(val);
  };

  const handleSetStartTime = (val) => {
    setStartTime(val);
  };

  const handleSetEndTime = (val) => {
    setEndTime(val);
  };

  const handleCallFilter = (shouldSearch) => {
    shouldSearch && handleGetCourses();
  };

  return (
    <DefaultLayout title="Search Courses" id="course-search-page">
      <Grid container spacing={2} id="course-search-filters">
        <Grid item xs={12} md={5}>
          <TextField
            id="course-search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleGetCourses();
              }
            }}
            fullWidth
            variant="outlined"
            label="Search By Name"
            helperText="Must be an exact match ('anth 1', 'bio 1', etc)"
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => handleGetCourses()} position="end">
                  <SearchIcon />
                </IconButton>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <Button
            variant="contained"
            id="advanced-filter-button"
            size="large"
            style={{ height: 50 }}
            onClick={handleOpenFilterModal}
          >
            Advanced Filter {filterCount >= 1 && `(${filterCount})`}
          </Button>
        </Grid>
        {mdUp && (
          <Grid item xs={12}>
            <FormControlLabel
              value="end"
              id="calendar-view-toggle"
              control={
                <Switch
                  color="primary"
                  checked={isCalendarView}
                  onChange={(v) => setIsCalendarView(v.target.checked)}
                />
              }
              label="Calendar View"
              labelPlacement="start"
              style={{ marginLeft: "auto" }}
            />
          </Grid>
        )}
      </Grid>
      <Accordion sx={{ boxShadow: "none", mt: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1-content"
          id="panel1-header"
          sx={{ width: "180px" }}
        >
          <Typography fontWeight={600}>Sync Courses</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 3 }}>
          <Grid>
            <TextField
              onChange={handleSetURL}
              fullWidth
              variant="outlined"
              label="URL"
              value={url}
              placeholder="https://www.csus.edu/class-schedule/fall-2024/MATH"
              helperText="The URL of the CSUS page to scrape course data from"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      id="sync-data-button"
                      variant="contained"
                      color="primary"
                      onClick={handleSyncData}
                    >
                      Sync Data
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </AccordionDetails>
      </Accordion>

      {loading ? (
        <Grid item xs={12} alignItems="center" textAlign="center">
          <CircularProgress />
        </Grid>
      ) : courses?.length >= 1 ? (
        <Grid container>
          <TableContainer>
            {isCalendarView && mdUp ? (
              <CalendarView id="calendar-view" courses={courses} />
            ) : (
              <Table>
                <TableBody id="courses-table">
                  {courses.map((courseWSnap, index) => {
                    const { data: course, snapshot } = courseWSnap;

                    return (
                      <React.Fragment key={course.id}>
                        <TableRow style={{ height: "20px" }}>
                          <TableCell
                            colSpan={4}
                            style={{ border: "none", padding: 0 }}
                          ></TableCell>
                        </TableRow>
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
                            Building
                          </TableCell>
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
                            Section
                          </TableCell>
                          <TableCell
                            style={{
                              borderRight: "2px solid #E5E4E2",
                              color: "#fff",
                            }}
                          >
                            Start Time
                          </TableCell>
                          <TableCell
                            style={{
                              borderRight: "2px solid #E5E4E2",
                              color: "#fff",
                            }}
                          >
                            End Time
                          </TableCell>
                          <TableCell
                            style={{
                              borderRight: "2px solid #E5E4E2",
                              color: "#fff",
                            }}
                          >
                            Professor
                          </TableCell>
                          <TableCell
                            style={{
                              borderRight: "2px solid #E5E4E2",
                              color: "#fff",
                            }}
                          >
                            Days
                          </TableCell>
                          <TableCell
                            style={{
                              borderRight: "2px solid #E5E4E2",
                              color: "#fff",
                            }}
                          >
                            Seats (available)
                          </TableCell>
                        </TableRow>
                        <TableRow
                          key={course.course_code}
                          className="course-result"
                          style={{ backgroundColor: "#eae9e8" }}
                        >
                          <TableCell
                            style={{
                              borderRight: "2px solid #E5E4E2",
                            }}
                          >
                            {course.building}
                          </TableCell>
                          <TableCell
                            style={{
                              borderRight: "2px solid #E5E4E2",
                            }}
                          >
                            {course.course_name}
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
                            {course.start_time
                              ? parseTime(course.start_time)
                              : "N/A"}
                          </TableCell>
                          <TableCell
                            style={{
                              borderRight: "2px solid #E5E4E2",
                            }}
                          >
                            {course.end_time
                              ? parseTime(course.end_time)
                              : "N/A"}
                          </TableCell>
                          <TableCell
                            style={{
                              borderRight: "2px solid #E5E4E2",
                            }}
                          >
                            {course.instructor}
                          </TableCell>
                          <TableCell
                            style={{
                              borderRight: "2px solid #E5E4E2",
                            }}
                          >
                            {course.days}
                          </TableCell>
                          <TableCell>{course.seats}</TableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </TableContainer>

          <Grid item xs={12}>
            <TablePagination
              id="courses-pagination"
              rowsPerPageOptions={[15, 30, 60]}
              component="div"
              count={-1}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Grid>
        </Grid>
      ) : (
        <Grid
          id="no-courses-found"
          item
          xs={12}
          alignItems="center"
          textAlign="center"
        >
          <Typography variant="h4">No Courses Found</Typography>
        </Grid>
      )}
      {showFilterModal && (
        <FilterModal
          isOpened={showFilterModal}
          courses={courses}
          section={section}
          startTime={startTime}
          showAvail={showAvail}
          endTime={endTime}
          onClose={handleCloseFilterModal}
          onFilter={handleCallFilter}
          onSetSection={handleSetSection}
          onSetStartTime={handleSetStartTime}
          onSetEndTime={handleSetEndTime}
          onSetShowAvail={setShowAvail}
        />
      )}
    </DefaultLayout>
  );
};
