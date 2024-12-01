import { Grid, Stack, Typography, Button } from "@mui/material";
import DefaultLayout from "../../components/default/layout";

function HomeMainPage() {
  const buttonStyle = {
    p: 2,
    justifyContent: "left",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "rgba(0, 100, 0, 0.7)",
    },
    fontWeight: "bold",
    boxShadow: "inset 0 -3px 0 rgba(0,0,0,0.2)",
    bgcolor: "#0c3a2b",
    color: "white",
    width: "100%",
    borderRadius: "4px",
  };

  return (
    <DefaultLayout title="CSUS Pal Course Analyzer">
      <Grid container sx={{ flexDirection: { xs: "column", md: "row" } }}>
        <Grid
          item
          xs={12}
          md={5}
          sx={{
            bgcolor: (theme) => theme.palette.primary.main,
            minHeight: {
              xs: "auto",
              md: "750px",
            },
            p: 3,
            borderRadius: "10px",
          }}
        >
          <Stack spacing={3}>
            <Typography
              variant="body1"
              sx={{ color: "white", fontSize: "1.2em" }}
            >
              The CSUS PAL program aims to support students in challenging STEM
              courses by offering supplementary classes led by former students.
              These classes, held in person, require campus classrooms that do
              not conflict with core STEM courses. However, identifying suitable
              times and classrooms poses a challenge due to the lack of software
              to analyze scheduling data for STEM courses.
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "white", fontSize: "1.2em" }}
            >
              The Supplementary Course Analyzer aims to solve this problem by
              providing a website that will analyze course times and determine
              optimal times for supplementary courses, while minimizing
              interference with major courses. We aim to make PAL courses more
              accessible to students and help the PAL program accomplish their
              goal of helping students learn.
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={12} md={7} sx={{ p: 3 }}>
          <Stack direction="column" spacing={0.5}>
            <Typography
              variant="h6"
              fontWeight="bold"
              bgcolor={(theme) => theme.palette.secondary.hornet}
              p={2}
              borderRadius={1}
              textAlign="left"
            >
              Access Analyzer
            </Typography>
            <Button
              id="search-courses-link"
              component="a"
              href="/search"
              sx={buttonStyle}
            >
              Search Courses
            </Button>
            <Button
              component="a"
              href="/StudentEnrollmentAnalyzer"
              sx={buttonStyle}
            >
              Student Enrollment Analyzer
            </Button>
            <Button
              id="student_availability"
              component="a"
              href="/StudentAvailability"
              sx={buttonStyle}
            >
              Student Availability
            </Button>
            <Typography
              variant="h6"
              fontWeight="bold"
              bgcolor={(theme) => theme.palette.secondary.hornet}
              p={2}
              borderRadius={1}
              textAlign="left"
            >
              About Analyzer
            </Typography>
            <Button component="a" href="/Creators" sx={buttonStyle}>
              Creators
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </DefaultLayout>
  );
}

export default HomeMainPage;
