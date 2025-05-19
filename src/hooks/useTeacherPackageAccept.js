import {useQuery} from 'react-query'

async function getTeacherPackagesAccept(id)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/getPackageAcceptByTeacherId/${id}`);
    const data = response.json();
    return data;
}

export const useTeacherPackageAccept = (id) => 
{
    return useQuery('get-teacher-package', ()=>  getTeacherPackagesAccept (id))
}