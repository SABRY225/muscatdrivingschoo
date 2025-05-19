import {useQuery} from 'react-query'

async function getPackage(id)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/getSinglePackage/${id}`)
    return response.json();
}

export const usePackage = (id)=> 
{
    return useQuery('get-package', ()=>  getPackage (id))
}