import {useQuery} from 'react-query'

async function getDeposits(token)
{
    console.log(token);

    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/wallets`,{
        headers:{
            "Authorization":token
        }
    });
    const data= response.json();
    console.log(data);
    
    return data;
}

export const useAdminDeposits = (token)=>
{
    return useQuery('get-admin-deposits',()=>getDeposits(token))
}