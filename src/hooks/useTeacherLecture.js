import {useQuery} from 'react-query'

async function getTeacherLecture(id)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/lecture/${id}`)
    return response.json();
}

export const useTeacherLecture = (id)=> 
{
    return useQuery('get-teacher-lecture', ()=>  getTeacherLecture (id))
}