import {
  Autocomplete,
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import uniq from "lodash/uniq";
import compact from "lodash/compact";

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
  onClose,
  onFilter,
  onSetSection,
  onSetEndTime,
  onSetStartTime,
}) => {
  const [startTimes, setStartTimes] = useState([]);
  const [endTimes, setEndTimes] = useState([]);
  const sections = Array.from({ length: 30 }, (_, index) => {
    return (index + 1).toString().padStart(2, "0");
  });

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
    onFilter();
    onClose();
  };

  return (
    <Modal
      open={isOpened}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{ ...style, width: 400 }}>
        <Typography
          id="modal-modal-title"
          variant="h5"
          component="h2"
          style={{ fontWeight: 600 }}
        >
          Course Filter
        </Typography>

        <Autocomplete
          sx={{ mt: 2 }}
          options={sections}
          renderInput={(params) => (
            <TextField {...params} label="Section" size="small" />
          )}
          onChange={(_, value) => handleSetSection(value)}
        />

        <Stack
          spacing={{ xs: 1, sm: 2 }}
          direction="row"
          useFlexGap
          sx={{ flexWrap: "wrap" }}
        >
          <Autocomplete
            sx={{ mt: 2, flex: 1 }}
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
          />

          <Autocomplete
            sx={{ mt: 2, flex: 1 }}
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
          />
        </Stack>

        <Box sx={{ textAlign: "right", mt: 3 }}>
          <Button
            variant="contained"
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
