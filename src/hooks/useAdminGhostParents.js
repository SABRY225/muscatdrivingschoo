import {useQuery} from 'react-query'

async function getParents(token)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/houtPassword/parents`,{
        headers:{
            "Authorization":token
        }
    })
    return response.json()
}

export const useAdminGhostParents = (token)=>
{
    return useQuery('get-admin-ghost-parents',()=>getParents(token))
}