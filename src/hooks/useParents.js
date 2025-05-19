import {useQuery} from 'react-query'

async function getParents()
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/parents`)
    return response.json()
}

export const useParents = ()=>
{
    return useQuery('get-levels',getParents)
}