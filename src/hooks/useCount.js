import {useQuery} from 'react-query'

async function getCounts()
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/dashboard/counts`)
    return response.json()
}

export const useCount = (id,token)=>
{
    return useQuery(['get-counts'],()=>getCounts())
}