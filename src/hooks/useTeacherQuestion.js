import {useQuery} from 'react-query'

async function getTeacherQuestion(id,token)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/questions/${id}`,{
        headers:{
            "Authorization":token
        }
    })
    const data = response.json();
    return data;
}

export const useTeacherQuestion = (id,token) => 
{
    return useQuery('get-teacher-lecture', ()=>  getTeacherQuestion (id,token))
}