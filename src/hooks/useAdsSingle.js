import {useQuery} from 'react-query'

async function getAdsSingle(id)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/guest/adssingle/${id}`)
    return response.json();
}

export const useAdsSingle = (id) =>
{
    return useQuery(['get-ads-id' , id], ()=> getAdsSingle(id) )
}