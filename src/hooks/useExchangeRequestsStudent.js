import {useQuery} from 'react-query'

async function getExchangeRequestsStudent(exchangeRequestsStudentId)
{   
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/exchangerequeststudent/${exchangeRequestsStudentId}`)
    return response.json()
}

export const useExchangeRequestsStudent = (exchangeRequestsStudentId)=>
{
    return useQuery(['get-Exchange-Requests-Students' , exchangeRequestsStudentId], ()=> getExchangeRequestsStudent(exchangeRequestsStudentId))
}