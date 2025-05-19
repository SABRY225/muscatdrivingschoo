import * as React from "react";
import { Button, styled, Box , InputLabel} from "@mui/material";
import List from "@mui/material/List";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useAdsImagesAdsId } from "../../hooks/useAdsImagesAdsId";
import Cookies from "js-cookie";
const Image = styled("img")({
  width: "100px",
});


export default function AdsImages({ AdsId }) {
  const { t }     = useTranslation();
  const { guest } = useSelector((state) => state.guest);
  const { data }  = useAdsImagesAdsId(AdsId);
  console.log(data);
  const lang      = Cookies.get("i18next") || "en";
  
  return (
    <Box sx={{ marginBottom: "26px" , backgroundColor:"transparent"}}>
      <List
        dense
        sx={{ width: "100%", bgcolor: "background.paper" , backgroundColor:"transparent" }}
      >
        {data?.data.map((value) => {
          
          return (
            <>
            <Image
            sx={{  width: "100px" , height:"100px" , objectFit:"contain" , border:"1px solid #323232" , padding:"10px"  , borderRadius:"15px" , margin:"1%"}}
                src={ `${process.env.REACT_APP_API_KEY}images/${value.image}`}
              />
            </>
          
          );
        })}
      </List>
    </Box>
  );
}
