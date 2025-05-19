import {useQuery} from 'react-query'

async function getTeacherDues(id,token)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/credit/${id}`,{
        headers:{
            "Authorization":token
        }
    })
    return response.json()
}

export const useTeacherDues = (id,token)=>
{
    return useQuery(['get-teacher-credit',id],()=>getTeacherDues(id,token))
}