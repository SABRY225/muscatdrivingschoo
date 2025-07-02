import {useQuery} from 'react-query'

async function getAdsSingleTeacher(id)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/ads-single/${id}`)
    return response.json();
}

export const useAdsSingleTeacher = (id) =>
{
    return useQuery(['get-ads-id' , id], ()=> getAdsSingleTeacher(id) )
}