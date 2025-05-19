import {useQuery} from 'react-query'

async function getDrivingLicenses()
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/drivinglicenses`)
    return response.json()
}

export const useDrivingLicenses = ()=>
{
    return useQuery('get-DrivingLicenses',getDrivingLicenses)
}