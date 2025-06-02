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
    <Box className="currency" >
      <FormControl sx={{  width: 170}}>
        <Select
          variant="standard"
          sx={{
            color: "white",
            "& .MuiSvgIcon-root": {
              color: "white",
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
                // maxHeight: 48 * 3 + 8,
                width: 100,
                height:400
              },
            },
          }}
        >
          {currencies.map((name) => (
            <MenuItem
              key={name.title}
              value={name.title}
              style={{ width:"450px"}}
            >
              <div style={{display:"flex"}}>
              <div  style={{paddingLeft:"0.5rem"}}>
                <img src={`https://flagcdn.com/w320/${name.code}.png`} alt={name.code} style={{width:"30px"}} /></div>
              <div style={{paddingLeft:"0.5rem"}}>{lang === "ar" ? name.titleAr : name.titleEn}</div>
              </div>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
