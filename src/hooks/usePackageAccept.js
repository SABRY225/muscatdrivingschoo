import {useQuery} from 'react-query'

async function getPackageAccept()
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/getPackageAccept`)
    return response.json();
}

export const usePackagesAccept = ()=> 
{
    return useQuery('get-package-accept', ()=>  getPackageAccept ())
}