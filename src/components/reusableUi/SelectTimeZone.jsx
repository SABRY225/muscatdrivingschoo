import { Box, FormControl, MenuItem, Select } from "@mui/material";
import timezones from "../../data/timezones";

export default function SelectTimeZone({
  selectedTimezone,
  setSelectedTimezone,
}) {
  return (
    <Box sx={{ marginTop: "20px", marginBottom: "30px" }}>
      <FormControl fullWidth>
        <Select
          fullWidth
          variant="standard"
          value={selectedTimezone || ""}
          onChange={(e) => setSelectedTimezone(e.target.value)}
          MenuProps={{
            elevation: 0.3,
            PaperProps: {
              style: {
                maxHeight: 48 * 4 + 8,
              },
            },
          }}
        >
          {timezones.map((name, index) => (
            <MenuItem
              key={index + "a12"}
              value={name.text}
              sx={{ alignItem: "center" }}
            >
              {name.text}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
