import {useQuery} from 'react-query'

async function getTeachers()
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/teachers`)
    return response.json()
}

export const useTeachers = (id)=>
{
    return useQuery(['get-teachers',id],()=>getTeachers())
}