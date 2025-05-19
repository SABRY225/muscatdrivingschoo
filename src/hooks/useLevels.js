import {useQuery} from 'react-query'

async function getAllLevels()
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/levels`);
    const data = response.json();
    console.log(data);
    return data;
}

export const useLevels = ()=>
{
    return useQuery( [ 'get-levels' ] , ()=> getAllLevels() )
}