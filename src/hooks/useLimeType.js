import {useQuery} from 'react-query'

async function getLimeTypes()
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/limetypes`)
    return response.json()
}

export const useLimeType = ()=>
{
    return useQuery('get-LimeTypes',getLimeTypes)
}