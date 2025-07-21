import {useQuery} from 'react-query'

async function getLessonsPackage(studentId,packageId)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/student/previousLessons/package/${studentId}/${packageId}`)
    return response.json()
}

export const usePastLessonsPackage = (studentId,packageId)=>
{
    return useQuery(['get-past-lessons-package',studentId,packageId],()=>getLessonsPackage(studentId,packageId))
}