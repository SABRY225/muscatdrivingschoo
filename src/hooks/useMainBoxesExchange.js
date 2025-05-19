import {useQuery} from 'react-query'

async function getMainBoxesExchangeRequests(token)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/numbersExchangeRequests`,{
        headers:{
            "Authorization":token
        }
    })
    return response.json()
}

export const useMainBoxesExchange = (token)=>
{
    return useQuery('get-admin-boxes', ()=> getMainBoxesExchangeRequests(token))
}