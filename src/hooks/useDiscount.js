import {useQuery} from 'react-query'

async function getDiscount(id)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/discount/${id}`)
    return response.json();
}

export const useDiscount = (id)=> 
{
    return useQuery(['get-discount' , id], ()=>  getDiscount (id))
}