import { Paper, Typography, styled, Button, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect } from 'react';
import { convertCurrency } from '../../utils/convertCurrency';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const Image = styled("img")({
  width: "100px",
  height: "100px",
  objectFit: "cover",
  borderRadius: "50%",
  marginTop: "20px",
  border: "1px solid #CCC",
  padding: "4px",
});

export default function Discounts({ discounts }) {
  const navigate = useNavigate();
  const lang = Cookies.get("i18next") || "en";
  const { t } = useTranslation();
    const { currency } = useSelector(state => state.currency);
  


  
const slideCount = discounts.length;

const settings = {
  dots: true,
  infinite: slideCount > 3,
  speed: 500,
  slidesToShow: slideCount >= 3 ? 3 : slideCount,
  slidesToScroll: slideCount >= 3 ? 3 : slideCount,
  initialSlide: 0,
  rtl: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: slideCount >= 3 ? 3 : slideCount,
        slidesToScroll: slideCount >= 3 ? 3 : slideCount,
        infinite: slideCount > 3,
        dots: true
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 1
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
};
 const [convertedDiscounts, setConvertedDiscounts] = useState([]);

  useEffect(() => {
    async function convertAll() {
      const converted = await Promise.all(
        discounts.map(async (item) => {
          const before = await convertCurrency(item.amountBeforeDiscount, item.currency, currency);
          const after = await convertCurrency(item.amountAfterDiscount, item.currency, currency);
          return { ...item, amountBeforeDiscount: before, amountAfterDiscount: after };
        })
      );
      setConvertedDiscounts(converted);
    }

    if (discounts?.length > 0) {
      convertAll();
    }
  }, [discounts, currency]);
  return (
    <Box sx={{ padding: "32px 24px", marginY: "30px" }}>
      <Typography sx={{
        fontSize: { md: "26px", xs: "22px" },
        fontWeight: "700",
        color: "#800020",
        textAlign: "center",
        marginBottom: "50px"
      }}>
        {t('home_discounts')}
      </Typography>

      <Slider {...settings}>
        {convertedDiscounts?.length > 0 &&
          convertedDiscounts.map((item) => (
            <Box key={item.id} px={2}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  textAlign: "center",
                  borderRadius: 4,
                  backgroundColor: "#f9f9f9",
                  position: "relative",
                  height: "100%",
                  maxWidth: "300px",
                  margin: "auto",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  marginBottom:"1rem"
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    backgroundColor: "#d32f2f",
                    color: "white",
                    padding: "5px 10px",
                    borderRadius: "20px",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  {item?.percentage}%
                </Box>
                <Box
                  sx={{
                    display:"flex",
                    justifyContent:"center",
                    color: "white",
                    padding: "5px 10px",
                    borderRadius: "20px",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                                 <Image
                  alt={lang === "ar" ? item?.titleAR : item?.titleEN}
                  src={`${process.env.REACT_APP_API_KEY}images/${item?.image}`}
                />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 2, color: "#212121" }}>
                  {lang === "ar" ? item?.titleAR : item?.titleEN}
                </Typography>

                <Typography variant="body2" sx={{ color: "#666", my: 1 }}>
                  {lang === "ar" ? item.descriptionAR : item.descriptionEN}
                </Typography>

                <Box sx={{ my: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    <del>{item.amountBeforeDiscount}</del> &nbsp; <del>{t(currency)}</del> &nbsp;
                    <Typography variant="caption" component="span">
                      {t("txt_amountBeforeDiscount")}
                    </Typography>
                  </Typography>
                  <Typography variant="body1" color="primary">
                    {item.amountAfterDiscount} &nbsp; {t(currency)} &nbsp;
                    <Typography variant="caption" component="span">
                      {t("txt_amountAfterDiscount")}
                    </Typography>
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => navigate(`/discount-details/${item.TeacherId}/${item.id}`)}
                >
                  {t("discount_view")}
                </Button>
              </Paper>
            </Box>
          ))}
      </Slider>
    </Box>
  );
}
