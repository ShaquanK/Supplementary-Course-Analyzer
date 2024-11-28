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
import {useMath29TimeSlotCounts} from "./components/Analyzers/Math29";
import {useMath12TimeSlotCounts} from "./components/Analyzers/Math12";
import {useMath30TimeSlotCounts} from "./components/Analyzers/Math30";
import {useMath31TimeSlotCounts} from "./components/Analyzers/Math31";
import {useMath32TimeSlotCounts} from "./components/Analyzers/Math32";
import {useBio25TimeSlotCounts} from "./components/Analyzers/Bio25";
import {useBio26TimeSlotCounts} from "./components/Analyzers/Bio26";
import {useBio131TimeSlotCounts} from "./components/Analyzers/Bio131";
import {useChem4TimeSlotCounts} from "./components/Analyzers/Chem4";






import DefaultLayout from "../../components/default/layout";
import { collectionAPI } from "../../routes/collection/collection";

import { ExpandMore } from "@mui/icons-material";
import axios from "axios";





export const StudentEnrollmentAnalyzerMainPage = () => {
  const [selectedTable, setSelectedTable] = useState("math12");
  const [loading, setLoading] = useState(false);
  const [url, setURL] = useState("https://www.csus.edu/class-schedule/fall-2024/MATH");
  const [filteredCourses, setFilteredCourses] = useState([]);

  const Math12TimeSlotCounts = useMath12TimeSlotCounts();
  const Math29TimeSlotCounts = useMath29TimeSlotCounts();
  const Math30TimeSlotCounts = useMath30TimeSlotCounts();
  const Math31TimeSlotCounts = useMath31TimeSlotCounts();
  const Math32TimeSlotCounts = useMath32TimeSlotCounts();
  const Bio25TimeSlotCounts = useBio25TimeSlotCounts();
  const Bio26TimeSlotCounts = useBio26TimeSlotCounts();
  const Bio131TimeSlotCounts = useBio131TimeSlotCounts();
  const Chem4TimeSlotCounts = useChem4TimeSlotCounts();

  // Handle table selection change
  const handleTableChange = (event) => {
    setSelectedTable(event.target.value);
  };

  // Handle URL input change
  const handleSetURL = (e) => {
    setURL(e.target.value);
  };const handleSyncData = async () => {
    setLoading(true);
    try {
      const headers = "Section, Seats, Days, Instructor, StartTime, EndTime, Building";
      const result = await axios.get(
        `http://localhost:5000/scrape?url=${encodeURIComponent(url)}&headers=${headers}`
      );
      
      
      await collectionAPI.syncDataToFirebase(result.data, "Fall", "2024-25");
      
      // Fetch updated courses and update state
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

  // Effect to set filtered courses initially
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
    <div>
      <DefaultLayout />
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
          <Grid spacing={2}>
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
                      variant="contained"
                      color="primary"
                      onClick={handleSyncData}
                      disabled={loading}
                    >
                      {loading ? "Syncing..." : "Sync Data"}
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </AccordionDetails>
      </Accordion>

      
      <Box mb={2} display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h6">Select Data Table</Typography>
        <Select value={selectedTable} onChange={handleTableChange} fullWidth>
          
          <MenuItem value="math29">Math 29 Time Slots</MenuItem>
          <MenuItem value="math12">Math 12 Time Slots</MenuItem>
          <MenuItem value="math30">Math 30 Time Slots</MenuItem>
          <MenuItem value="math31">Math 31 Time Slots</MenuItem>
          <MenuItem value="math32">Math 32 Time Slots</MenuItem>
          <MenuItem value="Bio25">Bio 25 Time Slots</MenuItem>
          <MenuItem value="Bio26">Bio 26 Time Slots</MenuItem>
          <MenuItem value="Bio131">Bio 131 Time Slots</MenuItem>
          <MenuItem value="chem4">Chem 4 Time Slots</MenuItem>




        </Select>
      </Box>
      <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: "auto" }}>
        
        

        {selectedTable === "math12" && (
          <Box display="flex" justifyContent="space-between" p={2}>
            <Box width="48%" component={Paper} p={2}>
              <Typography variant="subtitle1">MWF Time Slots</Typography>
              <Table size="small">
                <TableBody>
                  {Object.entries(Math12TimeSlotCounts.MWF).map(([slot, count], idx) => (
                    <TableRow key={idx}>
                      <TableCell>{slot}</TableCell>
                      <TableCell>{count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
            <Box width="48%" component={Paper} p={2}>
              <Typography variant="subtitle1">TR Time Slots</Typography>
              <Table size="small">
                <TableBody>
                  {Object.entries(Math12TimeSlotCounts.TR).map(([slot, count], idx) => (
                    <TableRow key={idx}>
                      <TableCell>{slot}</TableCell>
                      <TableCell>{count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
        )}

</TableContainer>


<TableContainer component={Paper} sx={{ maxHeight: 400, overflow: "auto" }}>
{selectedTable === "math31" && (
          <Box display="flex" justifyContent="space-between" p={2}>
            <Box width="48%" component={Paper} p={2}>
              <Typography variant="subtitle1">MWF Time Slots</Typography>
              <Table size="small">
                <TableBody>
                  {Object.entries(Math31TimeSlotCounts.MWF).map(([slot, count], idx) => (
                    <TableRow key={idx}>
                      <TableCell>{slot}</TableCell>
                      <TableCell>{count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
            <Box width="48%" component={Paper} p={2}>
              <Typography variant="subtitle1">TR Time Slots</Typography>
              <Table size="small">
                <TableBody>
                  {Object.entries(Math31TimeSlotCounts.TR).map(([slot, count], idx) => (
                    <TableRow key={idx}>
                      <TableCell>{slot}</TableCell>
                      <TableCell>{count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
        )}
</TableContainer>



<TableContainer component={Paper} sx={{ maxHeight: 400, overflow: "auto" }}>
{selectedTable === "Bio26" && (
          <Box display="flex" justifyContent="space-between" p={2}>
            <Box width="48%" component={Paper} p={2}>
              <Typography variant="subtitle1">MWF Time Slots</Typography>
              <Table size="small">
                <TableBody>
                  {Object.entries(Bio26TimeSlotCounts.MWF).map(([slot, count], idx) => (
                    <TableRow key={idx}>
                      <TableCell>{slot}</TableCell>
                      <TableCell>{count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
            <Box width="48%" component={Paper} p={2}>
              <Typography variant="subtitle1">TR Time Slots</Typography>
              <Table size="small">
                <TableBody>
                  {Object.entries(Bio26TimeSlotCounts.TR).map(([slot, count], idx) => (
                    <TableRow key={idx}>
                      <TableCell>{slot}</TableCell>
                      <TableCell>{count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
        )}
</TableContainer>


<TableContainer component={Paper} sx={{ maxHeight: 400, overflow: "auto" }}>
{selectedTable === "chem4" && (
          <Box display="flex" justifyContent="space-between" p={2}>
            <Box width="48%" component={Paper} p={2}>
              <Typography variant="subtitle1">MWF Time Slots</Typography>
              <Table size="small">
                <TableBody>
                  {Object.entries(Chem4TimeSlotCounts.MWF).map(([slot, count], idx) => (
                    <TableRow key={idx}>
                      <TableCell>{slot}</TableCell>
                      <TableCell>{count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
            <Box width="48%" component={Paper} p={2}>
              <Typography variant="subtitle1">TR Time Slots </Typography>
              <Table size="small">
                <TableBody>
                  {Object.entries(Chem4TimeSlotCounts.TR).map(([slot, count], idx) => (
                    <TableRow key={idx}>
                      <TableCell>{slot}</TableCell>
                      <TableCell>{count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
        )}
</TableContainer>

<TableContainer component={Paper} sx={{ maxHeight: 400, overflow: "auto" }}>
{selectedTable === "Bio131" && (
          <Box display="flex" justifyContent="space-between" p={2}>
            <Box width="48%" component={Paper} p={2}>
              <Typography variant="subtitle1">MWF Time Slots</Typography>
              <Table size="small">
                <TableBody>
                  {Object.entries(Bio131TimeSlotCounts.MWF).map(([slot, count], idx) => (
                    <TableRow key={idx}>
                      <TableCell>{slot}</TableCell>
                      <TableCell>{count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
            <Box width="48%" component={Paper} p={2}>
              <Typography variant="subtitle1">TR Time Slots</Typography>
              <Table size="small">
                <TableBody>
                  {Object.entries(Bio131TimeSlotCounts.TR).map(([slot, count], idx) => (
                    <TableRow key={idx}>
                      <TableCell>{slot}</TableCell>
                      <TableCell>{count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
        )}
</TableContainer>

<TableContainer component={Paper} sx={{ maxHeight: 400, overflow: "auto" }}>
{selectedTable === "Bio25" && (
          <Box display="flex" justifyContent="space-between" p={2}>
            <Box width="48%" component={Paper} p={2}>
              <Typography variant="subtitle1">MWF Time Slots</Typography>
              <Table size="small">
                <TableBody>
                  {Object.entries(Bio25TimeSlotCounts.MWF).map(([slot, count], idx) => (
                    <TableRow key={idx}>
                      <TableCell>{slot}</TableCell>
                      <TableCell>{count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
            <Box width="48%" component={Paper} p={2}>
              <Typography variant="subtitle1">TR Time Slots</Typography>
              <Table size="small">
                <TableBody>
                  {Object.entries(Bio25TimeSlotCounts.TR).map(([slot, count], idx) => (
                    <TableRow key={idx}>
                      <TableCell>{slot}</TableCell>
                      <TableCell>{count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
        )}
</TableContainer>

<TableContainer component={Paper} sx={{ maxHeight: 400, overflow: "auto" }}>
{selectedTable === "math32" && (
          <Box display="flex" justifyContent="space-between" p={2}>
            <Box width="48%" component={Paper} p={2}>
              <Typography variant="subtitle1">MWF Time Slots</Typography>
              <Table size="small">
                <TableBody>
                  {Object.entries(Math32TimeSlotCounts.MWF).map(([slot, count], idx) => (
                    <TableRow key={idx}>
                      <TableCell>{slot}</TableCell>
                      <TableCell>{count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
            <Box width="48%" component={Paper} p={2}>
              <Typography variant="subtitle1">TR Time Slots</Typography>
              <Table size="small">
                <TableBody>
                  {Object.entries(Math32TimeSlotCounts.TR).map(([slot, count], idx) => (
                    <TableRow key={idx}>
                      <TableCell>{slot}</TableCell>
                      <TableCell>{count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
        )}
</TableContainer>


<TableContainer component={Paper} sx={{ maxHeight: 400, overflow: "auto" }}>
{selectedTable === "math29" && (
          <Box display="flex" justifyContent="space-between" p={2}>
            <Box width="48%" component={Paper} p={2}>
              <Typography variant="subtitle1">MWF Time Slots</Typography>
              <Table size="small">
                <TableBody>
                  {Object.entries(Math29TimeSlotCounts.MWF).map(([slot, count], idx) => (
                    <TableRow key={idx}>
                      <TableCell>{slot}</TableCell>
                      <TableCell>{count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
            <Box width="48%" component={Paper} p={2}>
              <Typography variant="subtitle1">TR Time Slots</Typography>
              <Table size="small">
                <TableBody>
                  {Object.entries(Math29TimeSlotCounts.TR).map(([slot, count], idx) => (
                    <TableRow key={idx}>
                      <TableCell>{slot}</TableCell>
                      <TableCell>{count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
        )}
</TableContainer>


<TableContainer component={Paper} sx={{ maxHeight: 400, overflow: "auto" }}>
{selectedTable === "math30" && (
          <Box display="flex" justifyContent="space-between" p={2}>
            <Box width="48%" component={Paper} p={2}>
              <Typography variant="subtitle1">MWF Time Slots</Typography>
              <Table size="small">
                <TableBody>
                  {Object.entries(Math30TimeSlotCounts.MWF).map(([slot, count], idx) => (
                    <TableRow key={idx}>
                      <TableCell>{slot}</TableCell>
                      <TableCell>{count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
            <Box width="48%" component={Paper} p={2}>
              <Typography variant="subtitle1">TR Time Slots</Typography>
              <Table size="small">
                <TableBody>
                  {Object.entries(Math30TimeSlotCounts.TR).map(([slot, count], idx) => (
                    <TableRow key={idx}>
                      <TableCell>{slot}</TableCell>
                      <TableCell>{count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
        )}
</TableContainer>
    </div>
  );
};

export default StudentEnrollmentAnalyzerMainPage;