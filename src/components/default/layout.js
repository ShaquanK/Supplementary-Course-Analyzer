import React from "react";
import { Footer } from "./footer";
import { TopNav } from "./top-nav";
import {
  Box,
  Card,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";

const DefaultLayout = ({ title, children, ...others }) => {
  const isLargeScreen = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const containerWidth = isLargeScreen ? "1140px" : "100%";

  return (
    <div>
      <TopNav />
      <Grid container justifyContent="center" id={others?.id}>
        <Grid item sx={{ width: containerWidth }}>
          <Stack p={3} spacing={2}>
            <Card sx={{ p: 2 }}>
              {title && (
                <Box mb={2}>
                  <Typography
                    variant="h4"
                    id={`${others?.id}-title`}
                    sx={{
                      fontStyle: "italic",
                      fontWeight: "bold",
                      color: (theme) => theme.palette.primary.main,
                    }}
                  >
                    {title}
                  </Typography>
                </Box>
              )}
              {children}
            </Card>
          </Stack>
        </Grid>
      </Grid>
      {/* <Footer /> */}
    </div>
  );
};

export default DefaultLayout;
