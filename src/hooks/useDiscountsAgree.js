import {useQuery} from 'react-query'

async function getAllDiscountsAgree()
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/discounts/agree`);
    return response.json();
}

export const useDiscountsAgree = ()=> 
{
    return useQuery(['get-discount-agree'], ()=>  getAllDiscountsAgree ())
}