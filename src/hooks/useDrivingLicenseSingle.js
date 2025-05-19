import {useQuery} from 'react-query'

async function getSingleDrivingLicense(id)
{
    const response  = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/getSingleDrivingLicense/${id}`)
    return response.json();
}

export const useDrivingLicenseSingle = (id)=>
{
    return useQuery('get-sigle-drivinglicenses',getSingleDrivingLicense(id))
}