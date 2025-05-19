import {useQuery} from 'react-query'

async function getTeacherPackages(id,token)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/getPackageByTeacherId/${id}`,{
        headers:{
            "Authorization":token
        }
    })
    const data = response.json();
    return data;
}

export const useTeacherPackages = (id,token) => 
{
    return useQuery('get-teacher-package', ()=>  getTeacherPackages (id,token))
}