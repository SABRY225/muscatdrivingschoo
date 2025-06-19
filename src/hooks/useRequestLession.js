import {useQuery} from 'react-query'

async function getRequestLession(id)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/lesson/get-lessions-request-student/${id}`)
    return response.json()
}

export const useRequestLession = (id)=>
{
    return useQuery(['get-request-lession',id],()=>getRequestLession(id))
}