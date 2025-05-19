import {useQuery} from 'react-query'

async function getAllAdmins()
{
    console.log()
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/ads/`)
    return response.json()
}

export const useAds = () =>
{
    return useQuery('get-ads-all',()=>getAllAdmins() )
}