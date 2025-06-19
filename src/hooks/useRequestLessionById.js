import {useQuery} from 'react-query'

async function getRequestLession(id)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/lesson/${id}`)
    return response.json()
}

export const useRequestLessonById = (id)=>
{
    return useQuery(['get-request-lession-id',id],()=>getRequestLession(id))
}