import { styled, Box } from "@mui/material";
import List from "@mui/material/List";
import { useAdsImagesAdsIdTeacher } from "../../../hooks/useAdsImagesAdsIdTeacher";
const Image = styled("img")({
  width: "100px",
});

export default function AdsImages({ AdsId }) {
  const { data }  = useAdsImagesAdsIdTeacher(AdsId);
  console.log(data);
  
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
