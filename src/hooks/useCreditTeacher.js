import {useQuery} from 'react-query'

async function getTeacherDues(id,token)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/credit/${id}`,{
        headers:{
            "Authorization":token
        }
    })
    return response.json()
}

export const useCreditTeacher = (id,token)=>
{
    return useQuery(['get-teacher-credit-dues',id],()=>getTeacherDues(id,token))
}