import {useQuery} from 'react-query'

async function getPackages()
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/getAllPackages`)
    return response.json();
}

export const usePackages = ()=> 
{
    return useQuery('get-package-status', ()=>  getPackages ())
}