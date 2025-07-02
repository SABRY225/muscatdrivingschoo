import {useQuery} from 'react-query'

async function getStatsTeacher(id)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/stats/charts/${id}`);
    return response.json()
}

export const useStatsTeacher = (id) =>
{
    return useQuery('get-teacher-stats-charts',()=> getStatsTeacher(id))
}