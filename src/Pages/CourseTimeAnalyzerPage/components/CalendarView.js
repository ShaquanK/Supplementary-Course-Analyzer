import { Box, Card, Grid } from "@mui/material";

const COLUMNS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

export const CalendarView = ({ data }) => {
  const parseTime = (time) => {
    const [hour, minutePart] = time.split(":");
    const minute = minutePart ? parseInt(minutePart.slice(0, 2), 10) : 0;
    const period = minutePart ? minutePart.slice(2).trim() : "";

    let hourNum = parseInt(hour, 10);
    if (period === "PM" && hourNum < 12) {
      hourNum += 12;
    }
    if (period === "AM" && hourNum === 12) {
      hourNum = 0;
    }
    return hourNum * 60 + minute;
  };

  const getMatchedCourse = (day, hour) => {
    const matchedCourses = data?.filter((course) => {
      const courseDays = course.days.split("/").map((d) => d.trim());
      const [startTime, endTime] = course.time.split(" - ");

      const isDayMatched = courseDays.includes(day.toUpperCase());

      const startHour = parseTime(startTime);
      const endHour = parseTime(endTime);
      const hourToCheck = hour * 60;

      return isDayMatched && hourToCheck >= startHour && hourToCheck < endHour;
    });

    return matchedCourses;
  };

  return (
    <Box marginTop={1} marginBottom={5}>
      <Card style={{ border: "1px solid #d1d5db" }}>
        <Grid container justifyContent="space-between">
          <Grid item xs={1} borderBottom={1} borderColor="#d1d5db"></Grid>

          {COLUMNS.map((column) => (
            <Grid
              key={column}
              item
              xs={1.571}
              borderBottom={1}
              borderLeft={1}
              borderColor="#d1d5db"
            >
              <Box
                textAlign="center"
                padding={2}
                fontSize={14}
                fontWeight="bold"
                color="#333333"
              >
                {column}
              </Box>
            </Grid>
          ))}

          {new Array(24).fill("").map((_, hour) => {
            return (
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid
                  xs={1.011}
                  item
                  textAlign="center"
                  height="100%"
                  borderRight={1}
                  borderBottom={hour < 23 ? 1 : 0}
                  borderColor="#d1d5db"
                >
                  <Box
                    fontWeight="bold"
                    height="100%"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    {hour}:00
                  </Box>
                </Grid>
                {COLUMNS.map((day, idx) => {
                  console.log("idx", idx);

                  const matchedCourses = getMatchedCourse(day, hour);

                  return (
                    <Grid
                      xs={1.562}
                      item
                      textAlign="center"
                      height="100%"
                      borderRight={idx < 6 ? 1 : 0}
                      borderBottom={hour < 23 ? 1 : 0}
                      borderColor="#d1d5db"
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.2,
                        }}
                        padding={1}
                      >
                        {matchedCourses?.length ? (
                          <Box
                            sx={{
                              fontWeight: 600,
                              backgroundColor: "rgba(34, 197, 94, 0.8)",
                            }}
                            minHeight={30}
                            minWidth="100%"
                          />
                        ) : (
                          <Box minHeight={30}>-</Box>
                        )}
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            );
          })}
        </Grid>
      </Card>
    </Box>
  );
};
