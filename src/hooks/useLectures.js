import {useQuery} from 'react-query'

async function getAllLectures()
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/lectures`)
    const data = response.json();
    return data;
}

export const useLectures = () => 
{
    return useQuery('get-teacher-lecture', ()=>  getAllLectures())
}