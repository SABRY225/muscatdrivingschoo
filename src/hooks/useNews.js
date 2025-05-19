import {useQuery} from 'react-query'

async function getAllNews()
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/news`)
    const data = response.json();
    return data;
}

export const useNews = ()=> 
{
    return useQuery('get-news', ()=>  getAllNews() )
}