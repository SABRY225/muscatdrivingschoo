import {useQuery} from 'react-query'

async function getStudentThwanai(id,token)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/thawaniSession/${id}`,{
        headers:{
            "Authorization":token
        }
    })
    return response.json()
}

export const useAdminStudentThawani = (id,token)=>
{
    return useQuery(['get-student-tahwani-admin',id],()=>getStudentThwanai(id,token))
}