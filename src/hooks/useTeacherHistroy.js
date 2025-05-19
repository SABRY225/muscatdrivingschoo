import {useQuery} from 'react-query'

async function getTeacherHistroy(id,token)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/financialTeacher/${id}`,{
        headers:{
            "Authorization":token
        }
    })
    return response.json()
}

export const useTeacherHistroy = (id,token)=>
{
    return useQuery(['get-teacher-finicaial',id],()=>getTeacherHistroy(id,token))
}