import {useQuery} from 'react-query'

async function getAdmins(token)
{
    console.log()
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/getAdmins/`,{
        headers:{
            "Authorization":token
        }
    })
    return response.json()
}

export const useAdmins = (token) =>
{
    return useQuery('get-admin-single',()=> getAdmins( token))
}