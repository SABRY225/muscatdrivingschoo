import {useQuery} from 'react-query'

async function getTeacherLessons(id,token)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/getLessonByTeacherId/${id}`,{
        headers:{
            "Authorization":token
        }
    })
    return response.json();
}

export const useTeacherLessons = (id,token) => 
{
    return useQuery('get-teacher-lessons', ()=>  getTeacherLessons (id,token))
}