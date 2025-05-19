import {useQuery} from 'react-query'

async function getSingleLecture(id)
{
    console.log(id);
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/lecture/${id}`)
    const data = response.json();
    console.log(data);

    return data;
}

export const useLecture = (id) => 
{
    return useQuery([ 'get-single-lecture' , id ], ()=>  getSingleLecture(id))
}