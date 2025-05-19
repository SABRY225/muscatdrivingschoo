import {useQuery} from 'react-query'

async function getTeacherPackage(id)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/getSinglePackage/${id}`)
    return response.json();
}

export const useTeacherPackage = (id)=> 
{
    return useQuery('get-teacher-package', ()=>  getTeacherPackage (id))
}