import { Autocomplete, Box, FormControl, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import timezones from '../../data/timezones';

export default function SelectTimeZone({ selectedTimezone, setSelectedTimezone }) {
  const [selectedTimezoneDefult,setSelectedTimezoneDefult]=useState(null)
  useEffect(() => {
    if (!selectedTimezone) {
      // ابحث عن الـ timezone اللي يحتوي "Asia/Muscat" في utc[]
      const defaultTz = timezones.find(tz => tz.text=="(UTC+04:00) Abu Dhabi, Muscat");
      console.log(defaultTz.text);
      
      if (defaultTz) {
        setSelectedTimezoneDefult(defaultTz.text); // اعرض النص الكامل: (UTC+04:00) Abu Dhabi, Muscat
      }
    }
  }, [selectedTimezoneDefult]);
  console.log("selectedTimezone :",selectedTimezoneDefult);
  
  return (
    <Box sx={{ marginTop: '20px', marginBottom: '30px' }}>
      <FormControl fullWidth>
        <Autocomplete
          freeSolo
          fullWidth
          options={timezones.map((tz) => tz.text)}
          value={selectedTimezoneDefult || ''}
          onChange={(event, newValue) => setSelectedTimezone(newValue)}
          onInputChange={(event, newInputValue) => setSelectedTimezone(newInputValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              placeholder="Search or type timezone (e.g., Asia/Muscat)"
            />
          )}
        />
      </FormControl>
    </Box>
  );
}
