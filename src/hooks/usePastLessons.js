import {useQuery} from 'react-query'

async function getLessons(studentId)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/student/previousLessons/${studentId}`)
    return response.json()
}

export const usePastLessons = (studentId)=>
{
    return useQuery(['get-past-lessons',studentId],()=>getLessons(studentId))
}