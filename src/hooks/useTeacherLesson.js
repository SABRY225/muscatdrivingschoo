import {useQuery} from 'react-query'

async function getTeacherLesson(id,token)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/getSingleLesson/${id}`,{
        headers:{
            "Authorization":token
        }
    })
    return response.json();
}

export const useTeacherLesson = (id,token) => 
{
    return useQuery('get-teacher-lesson', ()=>  getTeacherLesson (id,token))
}