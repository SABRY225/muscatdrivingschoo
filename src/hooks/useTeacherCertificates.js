import {useQuery} from 'react-query'

async function getTeacherCertificates(id,token)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/getTeacherCertificates/${id}`,{
        headers:{
            "Authorization":token
        }
    })
    return response.json();
}

export const useTeacherCertificates = (id,token)=>
{
    return useQuery( 'get-teacher-certificates' ,()=> getTeacherCertificates(id,token))
}