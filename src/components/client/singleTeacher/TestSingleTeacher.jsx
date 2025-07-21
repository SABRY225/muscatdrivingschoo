import {  Paper, Typography  , Button, TableRow, TableCell, TableBody, TableHead, Table, TableContainer } from '@mui/material'
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next'
import currencies                   from "../../../data/currencies";

export default function TestSingleTeacher({teacher}) {
    const navigate = useNavigate();
    const lang = Cookies.get("i18next") || "en";
    const {t} = useTranslation()
    return (
       
<Paper sx={{ padding: "20px 5px", marginY: "30px" }}>
  <Typography sx={{ fontSize: "22px", marginBottom: "18px" }}>
    {t("tests")}
  </Typography>

  <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>{t("level")}</TableCell>
          <TableCell>{t("price")}</TableCell>
          <TableCell>{t("currency")}</TableCell>
          <TableCell>{t("book_test")}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {teacher?.Tests?.length > 0 ? (
          teacher?.Tests?.map((item, index) => {
            const current_currency = currencies.find(
              (e) => e.title === item?.currency
            );

            return (
              <TableRow key={item.id}>
                <TableCell>
                  {lang === "en"
                    ? item?.Level.titleEN
                    : item?.Level.titleAR}
                </TableCell>
                <TableCell>{item?.price}</TableCell>
                <TableCell>
                  {lang === "en"
                    ? current_currency?.titleEn
                    : current_currency?.titleAr}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() =>
                      navigate(`/test/${item.TeacherId}/${item.id}`)
                    }
                  >
                    {t("book_test")}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell colSpan={4}>
              <Typography align="center" className="notfound">
                {t("notfound_tests_teacher")}
              </Typography>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
</Paper>
    )
}
