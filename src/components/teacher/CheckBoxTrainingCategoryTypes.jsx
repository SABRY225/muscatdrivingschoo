import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import { Box, InputLabel } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useTrainingCategoryTypes } from "../../hooks/useTrainingCategoryTypes";
import Cookies from "js-cookie";

export default function CheckBoxTrainingCategoryTypes({ checked, setChecked }) {
  const { t }       = useTranslation();
    const {teacher} = useSelector((state) => state.teacher);
  const teacherFromRedux = JSON.parse(localStorage.getItem("teacher")) || teacher;
  const { data }    = useTrainingCategoryTypes();
  const lang        = Cookies.get("i18next") || "en";

  const handleToggle = (value) => () => {
    const currentIndex = checked.findIndex((l) => l.TrainingCategoryTypeId === value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push({ TrainingCategoryTypeId: value, TeacherId: teacherFromRedux.id });
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <Box sx={{ marginBottom: "26px" }}>
      <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
        {t("trainingcategorytypeStudent")}
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
                    checked.findIndex((l) => l.TrainingCategoryTypeId === value.id) !== -1
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
