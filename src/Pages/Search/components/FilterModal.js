import {
  Autocomplete,
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import uniq from "lodash/uniq";
import compact from "lodash/compact";

import { parseTime } from "../../../utils/parse-time";

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
  defaultValues,
  courses,
  isOpened,
  onClose,
  onFilter,
}) => {
  const [filter, setFilter] = useState(defaultValues);

  const sectionOptions = useMemo(() => {
    const sections = courses.map((course) => course.section);

    return uniq(sections);
  }, [courses]);

  const startTimeOptions = useMemo(() => {
    const startTimes = courses.map((course) => course.start_time);

    return compact(uniq(startTimes));
  }, [courses]);

  const endTimeOptions = useMemo(() => {
    const endTimes = courses.map((course) => course.end_time);

    return compact(uniq(endTimes));
  }, [courses]);

  const handleFilterSelect = (key, value) => {
    setFilter({
      ...filter,
      [key]: value,
    });
  };

  const handleFilter = () => {
    onClose();
    onFilter(filter);
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
          options={sectionOptions}
          renderInput={(params) => (
            <TextField {...params} label="Section" size="small" />
          )}
          onChange={(_, value) => handleFilterSelect("section", value)}
          defaultValue={filter.section}
        />

        <Stack
          spacing={{ xs: 1, sm: 2 }}
          direction="row"
          useFlexGap
          sx={{ flexWrap: "wrap" }}
        >
          <Autocomplete
            sx={{ mt: 2, flex: 1 }}
            options={startTimeOptions}
            renderInput={(params) => (
              <TextField {...params} label="Start Time" size="small" />
            )}
            getOptionLabel={(option) => parseTime(option)}
            renderOption={(props, option) => (
              <Typography sx={{ p: 1 }} {...props}>
                {parseTime(option)}
              </Typography>
            )}
            onChange={(_, value) => handleFilterSelect("startTime", value)}
            defaultValue={filter.startTime}
          />

          <Autocomplete
            sx={{ mt: 2, flex: 1 }}
            options={endTimeOptions}
            renderInput={(params) => (
              <TextField {...params} label="End Time" size="small" />
            )}
            getOptionLabel={(option) => parseTime(option)}
            renderOption={(props, option) => (
              <Typography sx={{ p: 1 }} {...props}>
                {parseTime(option)}
              </Typography>
            )}
            onChange={(_, value) => handleFilterSelect("endTime", value)}
            defaultValue={filter.endTime}
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
