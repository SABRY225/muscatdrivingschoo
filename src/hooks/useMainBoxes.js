import {useQuery} from 'react-query'

async function getMainBoxes(token)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/numbers`,{
        headers:{
            "Authorization":token
        }
    })
    return response.json()
}

export const useMainBoxes = (token)=>
{
    return useQuery('get-admin-boxes',()=>getMainBoxes(token))
}