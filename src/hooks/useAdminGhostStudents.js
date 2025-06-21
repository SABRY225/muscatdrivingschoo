import {useQuery} from 'react-query'

async function getStudents(token)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/houtPassword/students`,{
        headers:{
            "Authorization":token
        }
    })
    return response.json()
}

export const useAdminGhostStudents = (token)=>
{
    return useQuery('get-admin-ghost-students',()=>getStudents(token))
}