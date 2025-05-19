import {useQuery} from 'react-query'

async function getTeacherRefund(id)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/refunds/${id}`)
    return response.json()
}

export const useTeacherRefund = (id)=>
{
    return useQuery(['get-teacher-refund',id], ()=> getTeacherRefund(id))
}