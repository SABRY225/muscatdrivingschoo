import {useQuery} from 'react-query'

async function getExchangeRequestsTeachers()
{   
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/exchangerequestteachers`)
    return response.json()
}

export const useExchangeRequestsTeachers = ()=>
{
    return useQuery('get-Exchange-Requests-Teachers', ()=> getExchangeRequestsTeachers())
}