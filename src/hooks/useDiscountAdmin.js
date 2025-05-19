import {useQuery} from 'react-query'

async function getDiscountsAdmin(token)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/discounts`,{
        headers:{
            "Authorization":token
        }
    });
    return response.json();
}

export const useDiscountAdmin = (token)=> 
{
    return useQuery(['get-discount-status' , token], ()=>  getDiscountsAdmin (token))
}