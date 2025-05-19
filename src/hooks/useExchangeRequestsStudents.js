import {useQuery} from 'react-query'

async function getExchangeRequestsStudents()
{   
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/exchangerequeststudents`)
    return response.json()
}

export const useExchangeRequestsStudents = ()=>
{
    return useQuery('get-Exchange-Requests-Students', ()=> getExchangeRequestsStudents())
}