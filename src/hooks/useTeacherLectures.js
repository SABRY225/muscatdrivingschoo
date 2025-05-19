import {useQuery} from 'react-query'

async function getTeacherLectures(id,token)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/getLectureByTeacherId/${id}`,{
        headers:{
            "Authorization":token
        }
    })
    const data = response.json();
    return data;
}

export const useTeacherLectures = (id,token) => 
{
    return useQuery('get-teacher-lecture', ()=>  getTeacherLectures (id,token))
}