import {useQuery} from 'react-query'

async function getPackageByStatus(status)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/getPackageByStatus/${status}`)
    return response.json();
}

export const usePackageStatus = (status)=> 
{
    return useQuery('get-package-status', ()=>  getPackageByStatus (status))
}