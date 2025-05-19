import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import React from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useTranslation } from "react-i18next";
import AddSocail from "../../components/admin/AddSocail";
import GetSocial from "../../components/admin/GetSocial";

export default function AdminSocialMedia() {
  const { t } = useTranslation();
  const [value, setValue] = React.useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <AdminLayout>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label={t("show")} value="1" />
            {/* <Tab label={t("add")} value="2" /> */}
          </TabList>
        </Box>
        <TabPanel value="1">
          <GetSocial />
        </TabPanel>
        {/* <TabPanel value="2">
          <AddSocail />
        </TabPanel> */}
      </TabContext>
    </AdminLayout>
  );
}
