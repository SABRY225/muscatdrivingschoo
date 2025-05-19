import {useQuery} from 'react-query'

async function getLessons(token)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/sessions`,{
        headers:{
            "Authorization":token
        }
    })
    return response.json()
}

export const useAdminLessons = (token)=>
{
    return useQuery('get-admin-lessons',()=>getLessons(token))
}