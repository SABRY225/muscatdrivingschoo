import {useQuery} from 'react-query'

async function getAllDiscounts(token)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/discountsAll`);
    return response.json();
}

export const useDiscounts = (token)=> 
{
    return useQuery(['get-discount-status' , token], ()=>  getAllDiscounts (token))
}