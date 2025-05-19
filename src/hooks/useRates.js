import {useQuery} from 'react-query'

async function getRates(token)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/rates`)
    return response.json()
}

export const useRates = ()=>
{
    return useQuery('get-admin-single',()=>getRates())
}