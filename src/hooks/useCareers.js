import {useQuery} from 'react-query'

async function getCareers()
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/careers`)
    return response.json()
}

export const useCareers = ()=>
{
    return useQuery('get-careers',getCareers)
}