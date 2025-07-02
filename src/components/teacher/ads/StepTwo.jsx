import { Button, Box , Paper , Container , Grid , styled , Typography } from "@mui/material";
import React, { useState }  from "react";
import AdsStepper           from "../../../components/guest/AdsStepper";
import StepperButtonsGuest  from "../../../components/reusableUi/StepperButtonsGuest";
import Navbar               from "../../../components/Navbar";
import { changeGuestImage } from "../../../redux/guestSlice";
import { useTranslation }   from "react-i18next";
import { useSnackbar }      from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate , useParams  } from "react-router-dom";
import { useSocialMedia } from "../../../hooks/useSocialMedia";
import EmailOutlinedIcon  from "@mui/icons-material/EmailOutlined";
import call               from "../../../images/callsvg.svg";
import noimage            from "../../../images/noimage.svg";

const Label = styled("label")({
  width: "100%",
  display: "block",
  padding: "6px 16px",
  cursor: "pointer",
});

const Image = styled("img")({
  width: "300px",
});
const ImageLogo = styled("img")({
  height: "60px",

  "@media screen and (max-width: 600px) ": {
    height: "45px",
  },
  "@media screen and (max-width: 320px) ": {
    height: "27px",
  },
  objectFit: "cover",
  objectPosition: "bottom",
});
const ImageCall = styled("img")({
  width: "18px",
  height: "18px",
});

export default function StepTwo() {
  const { AdsId }         = useParams();

  const { guest, token }  = useSelector((state) => state.guest);
  const dispatch          = useDispatch();
  //image 1
  const [image,     setImage]     = useState(null);
  const [imageUrl,  setImageUrl]  = useState(noimage);

  //image 2
  const [imageTwo,     setImageTwo]     = useState(null);
  const [imageUrlTwo,  setImageUrlTwo]  = useState(noimage);

  //image 3
  const [imageThree,     setImageThree]     = useState(null);
  const [imageUrlThree,  setImageUrlThree]  = useState(noimage);

//image 4
const [imageFour,     setImageFour]     = useState(null);
const [imageUrlFour,  setImageUrlFour]  = useState(noimage);

//image 5
const [imageFive,     setImageFive]     = useState(null);
const [imageUrlFive,  setImageUrlFive]  = useState(noimage);

//image 6
const [imageSix,     setImageSix]     = useState(null);
const [imageUrlSix,  setImageUrlSix]  = useState(noimage);

//image 7
const [imageSeven,     setImageSeven]     = useState(null);
const [imageUrlSeven,  setImageUrlSeven]  = useState(noimage);

//image 8
const [imageEight,     setImageEight]     = useState(null);
const [imageUrlEight,  setImageUrlEight]  = useState(noimage);

  const [load,      setLoad]      = useState(false);

  const { t } = useTranslation();
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const { dataSocial } = useSocialMedia();
  const links = dataSocial?.data;
  const whatsAppLink = links
    ?.filter((obj) => obj.type === "Whatsapp")
    .map((obj) => obj.link);

  const navigate = useNavigate();

  const handleButtonSubmit = async () => {
    try {
      closeSnackbar();
      if (!imageUrl && !image) {
        enqueueSnackbar(t("image_required"), {
          variant: "error",
          autoHideDuration: 2000,
        });
        throw new Error("image is not found");
      } else {
        setLoad(true);
        const formData = new FormData();
        formData.append("image",image);
        const responseOne = await fetch(
          `${process.env.REACT_APP_API_KEY}api/v1/teacher/ads-step-two/${AdsId}`,
          {
            method: "POST",
            headers: {
              Authorization: token,
            },
            body: formData,
          }
        );
        if (responseOne.status !== 200 && responseOne.status !== 201) {
          enqueueSnackbar(t("image_upload_error"), {
            variant: "error",
            autoHideDuration: 2000,
          });
          throw new Error("failed occured");
        }
        setLoad(false);
        // const resDataOne = await responseOne.json();
        // dispatch(changeGuestImage({ image: resDataOne.data }));
        enqueueSnackbar(t("update_success"), {
          variant: "success",
          autoHideDuration: 1000,
        });

    console.log("image 1");
    if (!imageUrlTwo && imageTwo) {
        const formDataTwo      = new FormData();
        formDataTwo.append("image",  imageTwo);
        const responseTwo = await fetch(
          `${process.env.REACT_APP_API_KEY}api/v1/teacher/ads-step-two/${AdsId}`,
          {
            method: "POST",
            headers: {
              Authorization: token,
            },
            body: formDataTwo,
          }
        );
        if (responseTwo.status !== 200 && responseTwo.status !== 201) {
          enqueueSnackbar(t("image_upload_error"), {
            variant: "error",
            autoHideDuration: 2000,
          });
          throw new Error("failed occured");
        }
        setLoad(false);
        // const resDataTwo = await responseTwo.json();
        // dispatch(changeGuestImage({ imageTwo: resDataTwo.data }));
        enqueueSnackbar(t("update_success"), {
          variant: "success",
          autoHideDuration: 1000,
        });
        console.log("image 2");
    }

    if (!imageUrlThree && imageThree) {
        // Image Three
        const formDataThree      = new FormData();
        formDataThree.append("image",  imageThree);
        const responseThree = await fetch(
          `${process.env.REACT_APP_API_KEY}api/v1/teacher/ads-step-two/${AdsId}`,
          {
            method: "POST",
            headers: {
              Authorization: token,
            },
            body: formDataThree,
          }
        );
        if (responseThree.status !== 200 && responseThree.status !== 201) {
          enqueueSnackbar(t("image_upload_error"), {
            variant: "error",
            autoHideDuration: 2000,
          });
          throw new Error("failed occured");
        }
        setLoad(false);
        // const resDataThree = await responseThree.json();
        // dispatch(changeGuestImage({ imageThree: resDataThree.data }));
        enqueueSnackbar(t("update_success"), {
          variant: "success",
          autoHideDuration: 1000,
        });
        console.log("image 3");
    }

    if (!imageUrlFour && imageFour) {
        // Image Four
        const formDataFour      = new FormData();
        formDataFour.append("image",  imageFour);
        const responseFour = await fetch(
          `${process.env.REACT_APP_API_KEY}api/v1/teacher/ads-step-two/${AdsId}`,
          {
            method: "POST",
            headers: {
              Authorization: token,
            },
            body: formDataFour,
          }
        );
        if (responseFour.status !== 200 && responseFour.status !== 201) {
          enqueueSnackbar(t("image_upload_error"), {
            variant: "error",
            autoHideDuration: 2000,
          });
          throw new Error("failed occured");
        }
        setLoad(false);
        // const resDataFour = await responseFour.json();
        // dispatch(changeGuestImage({ imageFour: resDataFour.data }));
        enqueueSnackbar(t("update_success"), {
          variant: "success",
          autoHideDuration: 1000,
        });
        console.log("image 4");
    }
    
    if (!imageUrlFive && imageFive) {
        // Image Five
        const formDataFive      = new FormData();
        formDataFive.append("image",  imageFive);
        const responseFive = await fetch(
          `${process.env.REACT_APP_API_KEY}api/v1/teacher/ads-step-two/${AdsId}`,
          {
            method: "POST",
            headers: {
              Authorization: token,
            },
            body: formDataFive,
          }
        );
        if (responseFive.status !== 200 && responseFive.status !== 201) {
          enqueueSnackbar(t("image_upload_error"), {
            variant: "error",
            autoHideDuration: 2000,
          });
          throw new Error("failed occured");
        }
        setLoad(false);
        // const resDataFive = await responseFive.json();
        // dispatch(changeGuestImage({ imageFive: resDataFive.data }));
        enqueueSnackbar(t("update_success"), {
          variant: "success",
          autoHideDuration: 1000,
        });
    }

    console.log("image 5");
    if (!imageUrlSix && imageSix) {
        // Image Six
        const formDataSix      = new FormData();
        formDataSix.append("image",  imageSix);
        const responseSix = await fetch(
          `${process.env.REACT_APP_API_KEY}api/v1/teacher/ads-step-two/${AdsId}`,
          {
            method: "POST",
            headers: {
              Authorization: token,
            },
            body: formDataSix,
          }
        );
        if (responseSix.status !== 200 && responseSix.status !== 201) {
          enqueueSnackbar(t("image_upload_error"), {
            variant: "error",
            autoHideDuration: 2000,
          });
          throw new Error("failed occured");
        }
        setLoad(false);
        // const resDataSix = await responseSix.json();
        // dispatch(changeGuestImage({ imageSix: resDataSix.data }));
        enqueueSnackbar(t("update_success"), {
          variant: "success",
          autoHideDuration: 1000,
        });
    }

    console.log("image 6");
    if (!imageUrlSeven && imageSeven) {
        // Image Seven
        const formDataSeven      = new FormData();
        formDataSeven.append("image",  imageSeven);
        const responseSeven = await fetch(
          `${process.env.REACT_APP_API_KEY}api/v1/teacher/ads-step-two/${AdsId}`,
          {
            method: "POST",
            headers: {
              Authorization: token,
            },
            body: formDataSeven,
          }
        );
        if (responseSeven.status !== 200 && responseSeven.status !== 201) {
          enqueueSnackbar(t("image_upload_error"), {
            variant: "error",
            autoHideDuration: 2000,
          });
          throw new Error("failed occured");
        }
        setLoad(false);
        // const resDataSeven = await responseSeven.json();
        // dispatch(changeGuestImage({ imageSeven: resDataSeven.data }));
        enqueueSnackbar(t("update_success"), {
          variant: "success",
          autoHideDuration: 1000,
        });
    }

    console.log("image 7");
    if (!imageUrlEight && imageEight) {
        // Image Eight
        const formDataEight      = new FormData();
        formDataEight.append("image",  imageEight);
        const responseEight = await fetch(
          `${process.env.REACT_APP_API_KEY}api/v1/teacher/ads-step-two/${AdsId}`,
          {
            method: "POST",
            headers: {
              Authorization: token,
            },
            body: formDataEight,
          }
        );
        if (responseEight.status !== 200 && responseEight.status !== 201) {
          enqueueSnackbar(t("image_upload_error"), {
            variant: "error",
            autoHideDuration: 2000,
          });
          throw new Error("failed occured");
        }
        setLoad(false);
        // const resDataEight = await responseEight.json();
        // dispatch(changeGuestImage({ imageEight: resDataEight.data }));
        enqueueSnackbar(t("update_success"), {
          variant: "success",
          autoHideDuration: 1000,
        });

        console.log("image 8");
    }
        navigate("/teacher/create-ads/step3/" + AdsId);
    }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Navbar>
      <AdsStepper title={t("AdsImags")} active={1}></AdsStepper>
      <Container sx={{ marginTop: "20px", marginBottom: "60px" }}>
        <Grid container spacing={2}>
        <Grid item xs={12} lg={12}>
        <Paper sx={{ marginY: "0px", paddingY: "40px", paddingX: "30px" }}>
        <Grid container spacing={3}>
        <Grid item xs={12} lg={3} md={3}>
        <Box>
          {imageUrl && (
            <Image
            sx={{ width:"90%" , border:"1px solid #323232;" , padding:"10px" , borderRadius:"25px"}}
              src={
                imageUrl.startsWith("blob")
                  ? imageUrl
                  : `${imageUrl}`
              }
            />
          )}
        </Box>
        <input
          type="file" id="image" hidden
          onChange={(e) => {
            setImage(e.target.files[0]);
            setImageUrl(URL.createObjectURL(e.target.files[0]));
          }}
        />
        <Button
          variant="contained"
          sx={{ textTransform: "capitalize", padding: 0, marginBottom: "20px" }}>
          <Label htmlFor="image">{t("upload_photo")}</Label>
        </Button>
        </Grid>
        <Grid item xs={12} lg={3} md={3}>
        <Box>
          {imageUrlTwo && (
            <Image
            sx={{ width:"90%" , border:"1px solid #323232;" , padding:"10px" , borderRadius:"25px"}}
              src={
                imageUrlTwo.startsWith("blob")
                  ? imageUrlTwo
                  : `${imageUrlTwo}`
              }
            />
          )}
        </Box>
        <input
          type="file" id="imageTwo" hidden
          onChange={(e) => {
            setImageTwo(e.target.files[0]);
            setImageUrlTwo(URL.createObjectURL(e.target.files[0]));
          }}
        />
        <Button
          variant="contained"
          sx={{ textTransform: "capitalize", padding: 0, marginBottom: "20px" }}>
          <Label htmlFor="imageTwo">{t("upload_photo")}</Label>
        </Button>
        </Grid>
        <Grid item xs={12} lg={3} md={3}>
        <Box>
          {imageUrlThree && (
            <Image
              sx={{ width:"90%" , border:"1px solid #323232;" , padding:"10px" , borderRadius:"25px"}}
              src={
                imageUrlThree.startsWith("blob")
                  ? imageUrlThree
                  : `${imageUrlThree}`
              }
            />
          )}
        </Box>
        <input
          type="file" id="imageThree" hidden
          onChange={(e) => {
            setImageThree(e.target.files[0]);
            setImageUrlThree(URL.createObjectURL(e.target.files[0]));
          }}
        />
        <Button
          variant="contained"
          sx={{ textTransform: "capitalize", padding: 0, marginBottom: "20px" }}>
          <Label htmlFor="imageThree">{t("upload_photo")}</Label>
        </Button>
        </Grid>

        <Grid item xs={12} lg={3} md={3}>
        <Box>
          {imageUrlFour && (
            <Image
              sx={{ width:"90%" , border:"1px solid #323232;" , padding:"10px" , borderRadius:"25px"}}
              src={
                imageUrlFour.startsWith("blob")
                  ? imageUrlFour
                  : `${imageUrlFour}`
              }
            />
          )}
        </Box>
        <input
          type="file" id="imageFour" hidden
          onChange={(e) => {
            setImageFour(e.target.files[0]);
            setImageUrlFour(URL.createObjectURL(e.target.files[0]));
          }}
        />
        <Button
          variant="contained"
          sx={{ textTransform: "capitalize", padding: 0, marginBottom: "20px" }}>
          <Label htmlFor="imageFour">{t("upload_photo")}</Label>
        </Button>
        </Grid>

        <Grid item xs={12} lg={3} md={3}>
        <Box>
          {imageUrlFive && (
            <Image
              sx={{ width:"90%" , border:"1px solid #323232;" , padding:"10px" , borderRadius:"25px"}}
              src={
                imageUrlFive.startsWith("blob")
                  ? imageUrlFive
                  : `${imageUrlFive}`
              }
            />
          )}
        </Box>
        <input
          type="file" id="imageFive" hidden
          onChange={(e) => {
            setImageFive(e.target.files[0]);
            setImageUrlFive(URL.createObjectURL(e.target.files[0]));
          }}
        />
        <Button
          variant="contained"
          sx={{ textTransform: "capitalize", padding: 0, marginBottom: "20px" }}>
          <Label htmlFor="imageFive">{t("upload_photo")}</Label>
        </Button>
        </Grid>

        <Grid item xs={12} lg={3} md={3}>
        <Box>
          {imageUrlSix && (
            <Image
              sx={{ width:"90%" , border:"1px solid #323232;" , padding:"10px" , borderRadius:"25px"}}
              src={
                imageUrlSix.startsWith("blob")
                  ? imageUrlSix
                  : `${imageUrlSix}`
              }
            />
          )}
        </Box>
        <input
          type="file" id="imageSix" hidden
          onChange={(e) => {
            setImageSix(e.target.files[0]);
            setImageUrlSix(URL.createObjectURL(e.target.files[0]));
          }}
        />
        <Button
          variant="contained"
          sx={{ textTransform: "capitalize", padding: 0, marginBottom: "20px" }}>
          <Label htmlFor="imageSix">{t("upload_photo")}</Label>
        </Button>
        </Grid>

        <Grid item xs={12} lg={3} md={3}>
        <Box>
          {imageUrlSeven && (
            <Image
              sx={{ width:"90%" , border:"1px solid #323232;" , padding:"10px" , borderRadius:"25px"}}
              src={
                imageUrlSeven.startsWith("blob")
                  ? imageUrlSeven
                  : `${imageUrlSeven}`
              }
            />
          )}
        </Box>
        <input
          type="file" id="imageSeven" hidden
          onChange={(e) => {
            setImageSeven(e.target.files[0]);
            setImageUrlSeven(URL.createObjectURL(e.target.files[0]));
          }}
        />
        <Button
          variant="contained"
          sx={{ textTransform: "capitalize", padding: 0, marginBottom: "20px" }}>
          <Label htmlFor="imageSeven">{t("upload_photo")}</Label>
        </Button>
        </Grid>
        <Grid item xs={12} lg={3} md={3}>
        <Box>
          {imageUrlEight && (
            <Image
              sx={{ width:"90%" , border:"1px solid #323232;" , padding:"10px" , borderRadius:"25px"}}
              src={
                imageUrlEight.startsWith("blob")
                  ? imageUrlEight
                  : `${imageUrlEight}`
              }
            />
          )}
        </Box>
        <input
          type="file" id="imageEight" hidden
          onChange={(e) => {
            setImageEight(e.target.files[0]);
            setImageUrlEight(URL.createObjectURL(e.target.files[0]));
          }}
        />
        <Button
          variant="contained"
          sx={{ textTransform: "capitalize", padding: 0, marginBottom: "20px" }}>
          <Label htmlFor="imageEight">{t("upload_photo")}</Label>
        </Button>
        </Grid>
        
        </Grid>
        

        
        {guest?.image ? (
          <StepperButtonsGuest
            onSubmit={handleButtonSubmit}
            load={load}
          />
        ) : (
          <StepperButtonsGuest onSubmit={handleButtonSubmit} load={load} />
        )}
        
      </Paper>

        </Grid>
        </Grid>
      </Container> 
    </Navbar>
  );
}
