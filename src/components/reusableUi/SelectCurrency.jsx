import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import currencies from "../../data/currencies";
import { useSelector, useDispatch } from "react-redux";
import { changeCurrency } from "../../redux/currency";
import { Box } from "@mui/material";
import Cookies from "js-cookie";
import { fetchConversionRate } from "../../redux/conversionRate";

export default function SelectCurrency() {
  const { currency } = useSelector((state) => state.currency);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    dispatch(changeCurrency({ currency: e.target.value }));
    dispatch(fetchConversionRate(e.target.value));
  };
  const lang = Cookies.get("i18next") || "en";

  return (
    <Box className="currency">
      <FormControl sx={{ m: 1, width: 153 }}>
        <Select
          variant="standard"
          sx={{
            color: "white",
            "& .MuiSvgIcon-root": {
              color: "white",
              fontSize: "14px",
            },
          }}
          displayEmpty
          disableUnderline
          value={currency}
          onChange={handleChange}
          MenuProps={{
            elevation: 0.3,
            PaperProps: {
              style: {
                maxHeight: 48 * 3 + 8,
                width: 160,
              },
            },
          }}
        >
          {currencies.map((name) => (
            <MenuItem
              key={name.title}
              value={name.title}
              sx={{ alignItem: "center" }}
            >
              {lang === "ar" ? name.titleAr : name.titleEn}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
