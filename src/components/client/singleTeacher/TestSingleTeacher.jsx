import { Box, Divider, Grid, Paper, Typography , Avatar , Button } from '@mui/material'
import React from 'react'
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next'
import currencies                   from "../../../data/currencies";

export default function TestSingleTeacher({teacher}) {
    const navigate = useNavigate();
    const lang = Cookies.get("i18next") || "en";
    const {t} = useTranslation()
    return (
        <Paper sx={{padding:"32px 24px",marginY:"30px"}}>
            <Typography sx={{fontSize:"22px",marginBottom:"18px"}}>{t('tests_teacher')}</Typography>
           <table className='table_test'>
            <tr>
              <td> {t("level")} </td>
              <td> {t("price")} </td>
              <td> {t("currency")} </td>
              <td> {t("book_test") }</td>
            </tr>
           
            {
              teacher?.Tests?.length> 0 ?
              teacher?.Tests?.map((item,index)=>
        {
          console.log(currencies);

          let current_currency;
          current_currency = currencies.find((e) => e.title == item?.currency);
          console.log(current_currency);

            console.log(item);
            return(
            <>
                
                  <tr>
                    <td>{ (lang === "en") ? item?.Level.titleEN : item?.Level.titleAR }</td>
                    <td>{item?.price}</td>
                    <td>{ (lang == "en") ? current_currency.titleEn : current_currency.titleAr}</td>

                  

                    <Button className='btn-test-2' onClick={() => navigate(`/book-test/${item.id}`)}>
                      {t("book_test")}
                    </Button>
                </tr>
                              
              </>
              )
            })
            : <tr><td colSpan={3}><p class='notfound'>{t("notfound_tests_teacher")}</p></td></tr>
          }
          </table>
        </Paper>
    )
}
