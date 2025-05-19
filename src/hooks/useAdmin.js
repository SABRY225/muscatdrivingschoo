import {useQuery} from 'react-query'

async function getSingleAdmin(AdminId , token)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/get/${AdminId}`,{
        headers:{
            "Authorization":token
        }
    })
    return response.json()
}

export const useAdmin = ( AdminId ,token)=>
{
    return useQuery('get-admin-single',()=> getSingleAdmin(AdminId , token))
}