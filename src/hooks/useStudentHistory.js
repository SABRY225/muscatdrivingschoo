import {useQuery} from 'react-query'

async function getStudentHistory(id)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/student/wallet/${id}`)
    return response.json()
}

export const useStudentHistory = (id)=>
{
    return useQuery(['get-student-history',id],()=>getStudentHistory(id))
}