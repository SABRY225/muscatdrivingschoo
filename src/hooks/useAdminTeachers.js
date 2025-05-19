import {useQuery} from 'react-query'

async function getTeachers(token)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/teachers`,{
        headers:{
            "Authorization":token
        }
    })
    return response.json()
}

export const useAdminTeachers = (token)=>
{
    return useQuery('get-admin-teachers',()=>getTeachers(token))
}