import {useQuery} from 'react-query'

async function getCareer(id)
{
    console.log(id);

    const response   = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/career/${id}`)
    const re = response.json();
    return re;
}

export const useCareer = (id) =>
{
    return useQuery([ 'get-career' , id ] , () => getCareer(id))
}