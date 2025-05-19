import {useQuery} from 'react-query'

async function getCareers()
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/guest/careers`)
    return response.json()
}

export const useCareerGuest = (id) =>
{
    return useQuery(['get-career-guest', id], ()=> getCareers(id) )
}