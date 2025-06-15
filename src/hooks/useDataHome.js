import {useQuery} from 'react-query'

async function getAllData()
{
    console.log()
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/allservices`)
    return response.json()
}

export const useDataHome = () =>
{
    return useQuery('get-data-home',()=>getAllData() )
}