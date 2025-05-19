import {useQuery} from 'react-query'

async function getAdsDepartments()
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/adsdepartments`)
    return response.json()
}

export const useAdsDepartments = ()=>
{
    return useQuery('get-ads-department', ()=> getAdsDepartments())
}