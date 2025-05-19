import {useQuery} from 'react-query'

async function getTeacherHistroy(id,token)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/financialTeacher/${id}`,{
        headers:{
            "Authorization":token
        }
    })
    return response.json()
}

export const useAdminTeacherHistory = (id,token)=>
{
    return useQuery(['get-admin-teacher-finicaial',id],()=>getTeacherHistroy(id,token))
}