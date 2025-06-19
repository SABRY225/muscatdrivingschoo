import {useQuery} from 'react-query'

async function getcomplaints()
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/message/messages`)
    return response.json()
}

export const useAdminComplaint = ()=>
{
    return useQuery('get-admin-complaints',()=>getcomplaints())
}