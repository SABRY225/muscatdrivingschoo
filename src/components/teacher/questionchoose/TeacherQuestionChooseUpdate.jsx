import { DialogContent,DialogActions,InputLabel,Button, Box,TextField,Typography , styled , Autocomplete , FormControl , Select , MenuItem} from '@mui/material'
import React , { useState , useEffect } from 'react'
import { useForm,Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {useSnackbar} from 'notistack'
import Cookies from 'js-cookie';
import { useTeacherQuestion }     from "../../../hooks/useTeacherQuestion";

export default function TeacherQuestionChooseUpdate({handleClose,QuestionChoose,setQuestionChooses}) {
  const [ value, setValue]        = useState(null);
  const [ newValue, setNewValue]        = useState(null);
  const { teacher , token}        = useSelector((state)=>state.teacher)
    const {t} = useTranslation()
    const {closeSnackbar , enqueueSnackbar} = useSnackbar();
    const [image, setImage] = useState(null);
    const lang = Cookies.get("i18next") || "en";
    const { data , isLoading  }              = useTeacherQuestion(teacher?.id , token);
    const [ Questions , setQuestions]        = useState([]);
    const { register,control, formState: { errors }, handleSubmit } = useForm({
        defaultValues: {
          TeacherQuestionId : QuestionChoose?.TeacherQuestionId,
          title_ar          : QuestionChoose?.titleAR,
          title_en          : QuestionChoose?.titleEN,
          isCorrectAnswer   : QuestionChoose?.isCorrectAnswer
        }
    });

    useEffect(() => {
      if (data?.data) {
        setQuestions(data.data);
        
        let c;
        c = data.data.find((e) => e.id == QuestionChoose?.TeacherQuestionId);
        setValue(QuestionChoose?.TeacherQuestionId);
        setNewValue(c);
        //setValue(lang === "en" ? c.titleEN : c.titleAR);
      }
      
    }, [data]);

    async function onSubmit(data)
    {
       // closeSnackbar();
    const formData = new FormData();
    formData.append("TeacherId",          teacher.id);
    formData.append("titleAR",            data.title_ar);
    formData.append("titleEN",            data.title_en);
    //const TeacherQuestionId = Questions.find((e) => e.id == QuestionChoose?.TeacherQuestionId);

    formData.append("TeacherQuestionId",  value);
    formData.append("isCorrectAnswer",    data.isCorrectAnswer);


        try{
            const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/questionchoose/${QuestionChoose.id}`,{
                method:"PUT",
                headers:{
                    "Authorization":token,
                },
                body:formData,
            })
            if(response.status!==200&&response.status!==201)
            {
                throw new Error('failed occured')
            }
            const resData = await response.json()
            enqueueSnackbar(lang==="ar"?resData.msg.arabic:resData.msg.english,{variant:"success",autoHideDuration:8000})

            setQuestionChooses(back=>back.map(item=>
                {
                    console.log("Update Row");
                    console.log(data);
                    console.log("End Row Update");
                    return item.id === QuestionChoose.id?{...item,
                        titleAr           : data.title_ar,
                        titleEn           : data.title_en,
                        isCorrectAnswer   : data.isCorrectAnswer
                      }:item
                }))
            handleClose()
        }
        catch(err)
        {
            console.log(err)
        }
    }
    
    return (
        <Box sx={{width:"500px",maxWidth:"100%",paddingTop:"12px"}}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>

                <Autocomplete
                onChange={(event, newValue) => {
                  setValue(newValue?.id || null);
                }}
                id="size-small-standard-multi"
                size="small"
                options={Questions}
                value={newValue}
                getOptionLabel={(option) => option.titleAR}
                renderInput={(params) => (
                  <TextField {...params} variant="standard" />
                )}
              />
                
                <Box sx={{marginBottom:"18px"}}>
                <InputLabel sx={{marginBottom:"6px",fontSize:"14px"}}>{t('titleAr')}</InputLabel>
                        <Controller
                        name="title_ar"
                        control={control}
                        render={({ field }) => <TextField {...field} fullWidth/>}
                        {...register("title_ar", { required: "title Address is required" })}
                        />
                        {errors.title_ar?.type === 'required' && <Typography color="error" role="alert" sx={{fontSize:"13px",marginTop:"6px"}}>{t('required')}</Typography>}
                </Box>
                <Box sx={{marginBottom:"18px"}}>
                        <InputLabel sx={{marginBottom:"6px",fontSize:"14px"}}>{t('titleEn')}</InputLabel>
                        <Controller
                        name="title_en"
                        control={control}
                        render={({ field }) => <TextField {...field} fullWidth/>}
                        {...register("title_en", { required: "title arabic is required" })}
                        />
                        {errors.title_en?.type === 'required' && <Typography color="error" role="alert" sx={{fontSize:"13px",marginTop:"6px"}}>{t('required')}</Typography>}
                </Box>

          <Box sx={{ marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("isCorrectAnswer")}
              </InputLabel>
              <Controller
                name="isCorrectAnswer"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <Select
                      {...field}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      {...register("isCorrectAnswer", {
                        required: "isCorrectAnswer is required",
                      })}
                    >
                      <MenuItem value={"1"}>{t("yes")}</MenuItem>
                      <MenuItem value={"0"}>{t("no")}</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
              {errors.isCorrectAnswer?.type === "required" && (
                <Typography
                  color="error"
                  role="alert"
                  sx={{ fontSize: "13px", marginTop: "6px" }}
                >
                  {t("required")}
                </Typography>
              )}
        </Box>

          </DialogContent>
          <DialogActions>
                <Button onClick={handleClose}>{t('cancel')}</Button>
                <Button type="submit">
                    {t('save')}
                </Button>
            </DialogActions>
    </form>
    </Box>
    )
}
