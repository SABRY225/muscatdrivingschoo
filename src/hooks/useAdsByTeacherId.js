import {useQuery} from 'react-query'

async function getAdsByTeacherId(TeacherId)
{   
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/ads-all/${TeacherId}`)
    return response.json();
}

export const useAdsByTeacherId = (TeacherId) =>
{
    return useQuery(['get-ads-Teacher-id' , TeacherId], ()=> getAdsByTeacherId(TeacherId) )
}