import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import { Box, InputLabel, Radio } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useAdsDepartments } from "../../hooks/useAdsDepartments";
import Cookies from "js-cookie";

export default function CheckBoxCategories({ checked, setChecked }) {
  
  const { t }     = useTranslation();
  const { teacher } = useSelector((state) => state.teacher);
  const { data }  = useAdsDepartments();
  const lang      = Cookies.get("i18next") || "en";

  const handleToggle = (value) => () => {
    const currentIndex = checked.findIndex((l) => l.AdsDepartmentId === value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push({ AdsDepartmentId: value, TeacherId: teacher.id });
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };
  console.log(data?.data);
  
  return (
    <Box sx={{ marginBottom: "26px" }}>
      <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
        {t("ChooseDepartment")}
      </InputLabel>
      <List
        dense
        sx={{  width:"100%",bgcolor: "background.paper",display:"flex",flexDirection: 'row',flexWrap: 'wrap' }}
      >
        {data?.data.map((value) => {
          const labelId = `checkbox-list-secondary-label-${value.id}`;
          return (
            <ListItem
            sx={{width:"300px",m:2,backgroundColor:"#d0d3d4"}}
              key={value.id}
              secondaryAction={
                <Radio
                  size="2px"
                  edge="end"
                  onChange={handleToggle(value.id)}
                  checked={
                    checked.findIndex((l) => l.AdsDepartmentId === value.id) !== -1
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
