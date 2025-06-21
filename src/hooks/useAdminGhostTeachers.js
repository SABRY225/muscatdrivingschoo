import {useQuery} from 'react-query'

async function getTeachers(token)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/houtPassword/teachers`,{
        headers:{
            "Authorization":token
        }
    })
    return response.json()
}

export const useAdminGhostTeachers = (token)=>
{
    return useQuery('get-admin-ghost-teachers',()=>getTeachers(token))
}