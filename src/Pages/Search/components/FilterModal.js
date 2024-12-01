import {
  Autocomplete,
  Box,
  Button,
  FormControlLabel,
  Modal,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { parseTime } from "../../../utils/parse-time";
import { collectionAPI } from "../../../routes/collection/collection";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  pt: 2,
  px: 2,
  pb: 3,
};

export const FilterModal = ({
  isOpened,
  section,
  startTime,
  endTime,
  showAvail,
  onClose,
  onFilter,
  onSetSection,
  onSetEndTime,
  onSetStartTime,
  onSetShowAvail,
}) => {
  const [startTimes, setStartTimes] = useState([]);
  const [endTimes, setEndTimes] = useState([]);
  const sections = Array.from({ length: 30 }, (_, index) => {
    return (index + 1).toString().padStart(2, "0");
  });

  const [initialStartTime, setInitialStartTime] = useState(startTime);
  const [initialEndTime, setInitialEndTime] = useState(endTime);
  const [initialSection, setInitialSection] = useState(section);
  const [initialShowAvail, setInitialShowAvail] = useState(showAvail);

  const handleSetStartTime = (val) => {
    onSetStartTime(val);
  };

  const handleSetEndTime = (val) => {
    onSetEndTime(val);
  };

  const handleSetSection = (val) => {
    onSetSection(val);
  };

  const getTimes = async () => {
    return await collectionAPI.getUniqueTimesFromFirebase();
  };

  useEffect(() => {
    getTimes().then((resp) => {
      setStartTimes(resp?.startTimes);
      setEndTimes(resp?.endTimes);
    });
  }, []);

  const handleFilter = () => {
    // Check if any of the values (startTime, endTime, section, showAvail) have changed
    const hasFilterChanged =
      startTime !== initialStartTime ||
      endTime !== initialEndTime ||
      section !== initialSection ||
      showAvail !== initialShowAvail;

    onFilter(hasFilterChanged);

    onClose();
  };

  return (
    <Modal
      open={isOpened}
      onClose={onClose}
      aria-labelledby="course-filter-modal"
      id="course-filter-modal"
    >
      <Box id="course-filter-inner" sx={{ ...style, width: 400 }}>
        <Typography variant="h5" component="h2" style={{ fontWeight: 600 }}>
          Course Filter
        </Typography>

        <Autocomplete
          sx={{ mt: 2 }}
          id="section-input"
          options={sections}
          renderInput={(params) => (
            <TextField {...params} label="Section" size="small" />
          )}
          onChange={(_, value) => handleSetSection(value)}
          defaultValue={section}
        />

        <Stack
          spacing={{ xs: 1, sm: 2 }}
          direction="row"
          useFlexGap
          sx={{ flexWrap: "wrap" }}
        >
          <Autocomplete
            sx={{ mt: 2, flex: 1 }}
            id="start-time-input"
            options={startTimes}
            renderInput={(params) => (
              <TextField {...params} label="Start Time" size="small" />
            )}
            getOptionLabel={(option) => parseTime(option)}
            renderOption={(props, option) => (
              <Typography sx={{ p: 1 }} {...props}>
                {parseTime(option)}
              </Typography>
            )}
            onChange={(_, value) => handleSetStartTime(value)}
            defaultValue={startTime}
          />

          <Autocomplete
            sx={{ mt: 2, flex: 1 }}
            id="end-time-input"
            options={endTimes}
            renderInput={(params) => (
              <TextField {...params} label="End Time" size="small" />
            )}
            getOptionLabel={(option) => parseTime(option)}
            renderOption={(props, option) => (
              <Typography sx={{ p: 1 }} {...props}>
                {parseTime(option)}
              </Typography>
            )}
            onChange={(_, value) => handleSetEndTime(value)}
            defaultValue={endTime}
          />
        </Stack>

        <Stack mt={1}>
          <FormControlLabel
            value="end"
            id="available-classes-input"
            control={
              <Switch
                color="primary"
                checked={showAvail}
                onChange={(v) => onSetShowAvail(v.target.checked)}
              />
            }
            label="Show available classes only"
            labelPlacement="start"
            style={{ marginLeft: "auto" }}
          />
        </Stack>

        <Box sx={{ textAlign: "right", mt: 3 }}>
          <Button
            variant="contained"
            id="filter-button"
            style={{ marginLeft: "auto" }}
            onClick={handleFilter}
          >
            Filter
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
