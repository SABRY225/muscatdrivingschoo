import {useQuery} from 'react-query'

async function getSessions(id,token)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/sessions/${id}`,{
        headers:{
            "Authorization":token
        }
    })
    return response.json()
}

export const useTeacherSessions = (id,token)=>
{
    return useQuery(['get-teacher-allSessions',id],()=>getSessions(id,token))
}