import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useTranslation } from "react-i18next";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";

const style = { marginBottom: 30 };

export default function AdminAddProfit() {
  const { t } = useTranslation();
  const [profit, setProfit] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const { token } = useSelector((state) => state.admin);
  const lang = Cookies.get("i18next") || "en";

  const handleSubmit = async () => {
    if (profit >= 100 || profit < 0) {
      enqueueSnackbar(t("profit_error"), {
        variant: "error",
        autoHideDuration: 8000,
      });
      return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/admin/updateProfitRatio`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ profitRatio: profit }),
        }
      );
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("failed occured");
      }
      const resData = await response.json();
      enqueueSnackbar(
        lang === "ar" ? resData.msg.arabic : resData.msg.english,
        { variant: "success", autoHideDuration: 8000 }
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_KEY}api/v1/admin/profitRatio`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Request failed");
        }

        const resData = await response.json();
        setProfit(resData.profitRatio);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return (
    <AdminLayout>
      <h1 style={style}>{t("add_profit")}</h1>
      <TextField
        style={style}
        label={t("add_profit")}
        onChange={(e) => setProfit(e.target.value)}
        value={profit}
      />
      <br />
      <Button
        sx={style}
        variant="contained"
        type="submit"
        onClick={handleSubmit}
      >
        {t("save")}
      </Button>
    </AdminLayout>
  );
}
