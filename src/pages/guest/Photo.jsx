import { Button, styled, Box , Paper} from "@mui/material";
import React, { useState } from "react";
import Layout from "../../components/guest/Layout";
import StepperButtons from "../../components/reusableUi/StepperButtons";
import Navbar from "../../components/Navbar";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { changeGuestImage } from "../../redux/guestSlice";
import { useNavigate } from "react-router-dom";

const Label = styled("label")({
  width: "100%",
  display: "block",
  padding: "6px 16px",
  cursor: "pointer",
});

const Image = styled("img")({
  width: "300px",
});

export default function Photo() {
  const { guest, token }  = useSelector((state) => state.guest);
  const dispatch          = useDispatch();
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(guest?.image);
  const [load, setLoad]   = useState(false);

  const { t } = useTranslation();
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
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
      } else if (imageUrl && !image) {
        //navigate("/guest/AdditionalInformation");
      } else {
        setLoad(true);
        const formData = new FormData();
        formData.append("image", image);
        const response = await fetch(
          `${process.env.REACT_APP_API_KEY}api/v1/guest/editPhoto/${guest.id}`,
          {
            method: "POST",
            headers: {
              Authorization: token,
            },
            body: formData,
          }
        );
        if (response.status !== 200 && response.status !== 201) {
          enqueueSnackbar(t("image_upload_error"), {
            variant: "error",
            autoHideDuration: 2000,
          });
          throw new Error("failed occured");
        }
        setLoad(false);
        const resData = await response.json();
        dispatch(changeGuestImage({ image: resData.data }));
        enqueueSnackbar(t("update_success"), {
          variant: "success",
          autoHideDuration: 1000,
        });
        //navigate("/guest/AdditionalInformation");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Navbar>
      <Layout active={1} title={t("profile_photo")}>
      <Paper sx={{ padding: "20px" }}>
        <input
          type="file"
          id="image"
          hidden
          onChange={(e) => {
            setImage(e.target.files[0]);
            setImageUrl(URL.createObjectURL(e.target.files[0]));
          }}
        />
        <Button
          variant="contained"
          sx={{ textTransform: "capitalize", padding: 0, marginBottom: "20px" }}
        >
          <Label htmlFor="image">{t("replace_photo")}</Label>
        </Button>

        <Box>
          {imageUrl && (
            <Image
              src={
                imageUrl.startsWith("blob")
                  ? imageUrl
                  : `${process.env.REACT_APP_API_KEY}images/${imageUrl}`
              }
            />
          )}
        </Box>
        {guest?.image ? (
          <StepperButtons
            skipLink={"AdditionalInformation"}
            onSubmit={handleButtonSubmit}
            load={load}
          />
        ) : (
          <StepperButtons onSubmit={handleButtonSubmit} load={load} />
        )}
        
      </Paper>
      </Layout>
    </Navbar>
  );
}
