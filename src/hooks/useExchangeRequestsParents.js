import {useQuery} from 'react-query'

async function getExchangeRequestsParents()
{   
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/exchangerequestparents`)
    return response.json()
}

export const useExchangeRequestsParents = ()=>
{
    return useQuery('get-Exchange-Requests-Parents', ()=> getExchangeRequestsParents())
}