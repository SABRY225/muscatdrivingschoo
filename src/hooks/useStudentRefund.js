import {useQuery} from 'react-query'

async function getStudentRefund(id)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/student/refunds/${id}`)
    return response.json()
}

export const useStudentRefund = (id)=>
{
    return useQuery(['get-student-refund',id], ()=> getStudentRefund(id))
}