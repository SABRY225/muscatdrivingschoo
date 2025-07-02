import {useQuery} from 'react-query'

async function getStatsAdmins()
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/stats/charts`);
    return response.json()
}

export const useStatsAdmins = () =>
{
    return useQuery('get-admin-stats-charts',()=> getStatsAdmins())
}