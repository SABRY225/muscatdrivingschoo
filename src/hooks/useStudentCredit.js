import {useQuery} from 'react-query'

async function getCreditStudent(id,currency)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/student/Credit/${id}?currency=${currency}`)
    return response.json()
}

export const useStudentCredit = (id,currency)=>
{
    return useQuery(['get-student-credit',id],()=>getCreditStudent(id,currency))
}