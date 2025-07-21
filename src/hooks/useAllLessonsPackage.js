import {useQuery} from 'react-query'

async function getLessonsPackage(studentId,packageId)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/student/lessons/package/${studentId}/${packageId}`)
    return response.json()
}

export const useAllLessonsPackage = (studentId,packageId)=>
{
    return useQuery(['get-student-lessons-package',studentId,packageId],()=>getLessonsPackage(studentId,packageId))
}