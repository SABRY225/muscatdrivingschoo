import {useQuery} from 'react-query'

async function getTeacherQuestionChoose(TeacherId,token)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/questionchooses/${TeacherId}`,{
        headers:{
            "Authorization":token
        }
    })
    const data = response.json();
    return data;
}

export const useTeacherQuestionChoose = (TeacherId,token) => 
{
    return useQuery('get-teacher-lecture', ()=>  getTeacherQuestionChoose (TeacherId,token))
}