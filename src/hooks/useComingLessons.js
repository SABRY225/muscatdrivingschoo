import {useQuery} from 'react-query'

async function getLessons(studentId)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/student/comingLessons/${studentId}`)
    return response.json()
}

export const useComingLessons = (studentId)=>
{
    return useQuery(['get-coming-lessons',studentId],()=>getLessons(studentId))
}