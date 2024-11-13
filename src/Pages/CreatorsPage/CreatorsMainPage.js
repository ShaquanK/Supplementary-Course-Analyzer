import React from "react";
import DefaultLayout from "../../components/default/layout";
import { Grid, Typography, Box } from "@mui/material";
import scripters from "../../img/scripters.jpg";

function CreatorsMainPage() {
  return (
    <DefaultLayout title="Creators">
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
          <Typography
            variant="body1"
            sx={{ color: "white", fontSize: "1.4em" }}
          >
            We are a group of passionate Computer Science students at the
            California State University of Sacramento, driven by our desires to
            learn, innovate, and to achieve our goals. Together, we are
            committed to turning our ideas into reality and creating an app that
            reflects our hard work to help our fellow professors and students to
            improve their experience every semester in scheduling PAL sessions.
            We believe that through our hard work and collaboration, we can make
            a significant difference in the ease of creating schedules to help
            our fellow students, and are excited to see how our app can be used
            to save time and resources so that our professors can focus on what
            they do best, teaching our fellow students.
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          md={7}
          sx={{
            minHeight: {
              xs: "auto",
              md: "600px",
            },
            mt: {
              xs: 2,
              md: 0,
            },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          <Box
            component="img"
            src={scripters}
            alt="Creators Image"
            sx={{
              maxWidth: "90%", // Ensure the image fits within the available space
              maxHeight: "100%",
              objectFit: "contain", // Make sure the image scales without distorting
              position: "relative",
              top: 0,
              right: 0,
            }}
          />
        </Grid>
      </Grid>
    </DefaultLayout>
  );
}

export default CreatorsMainPage;
