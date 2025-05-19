import {useQuery} from 'react-query'

async function getGuest(id, token)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/guest/get/${id}`,{
        headers:{
            "Authorization":token
        }
    })
    return response.json()
}

export const useGuest = (id , token)=>
{
    return useQuery(['get-guest',id], ()=>getGuest(id , token))
}