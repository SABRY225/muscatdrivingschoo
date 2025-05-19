import {useQuery} from 'react-query'

async function getExchangeRequestsTeacher(exchangeRequestsTeacherId)
{   
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/exchangerequestteacher/${exchangeRequestsTeacherId}`)
    return response.json()
}

export const useExchangeRequestsTeacher = (exchangeRequestsTeacherId)=>
{
    return useQuery([ 'get-Exchange-Requests-Teacher' , exchangeRequestsTeacherId], ()=> getExchangeRequestsTeacher(exchangeRequestsTeacherId))
}