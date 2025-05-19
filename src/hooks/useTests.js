import {useQuery} from 'react-query'

async function getTests()
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/tests`);
    return response.json();
}

export const useTests = ()=>
{
    return useQuery(['get-tests'],()=> getTests())
}