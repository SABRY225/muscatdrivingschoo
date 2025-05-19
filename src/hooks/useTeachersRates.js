import {useQuery} from 'react-query'

async function getTeachersRates()
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/teachersRates`)
    return response.json()
}

export const useTeachersRates = ()=>
{
    return useQuery(['get-teachers'],()=>getTeachersRates())
}