import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import { Box, InputLabel } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLimeType } from "../../hooks/useLimeType";
import Cookies from "js-cookie";

export default function CheckBoxLimeType({ checked, setChecked }) {
  const { t }       = useTranslation();
  const teacher  = JSON.parse(localStorage.getItem("teacher"))
  const { data }    = useLimeType();
  const lang        = Cookies.get("i18next") || "en";

  const handleToggle = (value) => () => {
    const currentIndex = checked.findIndex((l) => l.LimeTypeId === value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push({ LimeTypeId: value, TeacherId: teacher.id });
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <Box sx={{ marginBottom: "26px" }}>
      <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
        {t("limetypeTeacher")}
      </InputLabel>
      <List
        dense
        sx={{ width: "100%", maxWidth: 360 }}
      >
        {data?.data.map((value) => {
          const labelId = `checkbox-list-secondary-label-${value.id}`;
          return (
            <ListItem
              key={value.id}
              secondaryAction={
                <Checkbox
                  size="2px"
                  edge="end"
                  onChange={handleToggle(value.id)}
                  checked={
                    checked.findIndex((l) => l.LimeTypeId === value.id) !== -1
                  }
                  inputProps={{ "aria-labelledby": labelId }}
                />
              }
              disablePadding
            >
              <ListItemButton>
                <ListItemText
                  id={labelId}
                  primary={lang === "en" ? value.titleEN : value.titleAR}
                  sx={{ textAlign: "start" }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}
