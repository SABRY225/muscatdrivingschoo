import {useQuery} from 'react-query'

async function getStatsStudent(id)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/student/stats/charts/${id}`);
    return response.json()
}

export const useStatsStudent = (id) =>
{
    return useQuery('get-student-stats-charts',()=> getStatsStudent(id))
}