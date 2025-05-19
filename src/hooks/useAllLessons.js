import {useQuery} from 'react-query'

async function getLessons(studentId)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/student/lessons/${studentId}`)
    return response.json()
}

export const useAllLessons = (studentId)=>
{
    return useQuery(['get-student-lessons',studentId],()=>getLessons(studentId))
}