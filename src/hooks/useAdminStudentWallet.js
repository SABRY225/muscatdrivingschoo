import {useQuery} from 'react-query'

async function getStudentWallet(id,token)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/studentWallet/${id}`,{
        headers:{
            "Authorization":token
        }
    })
    return response.json()
}

export const useAdminStudentWallet = (id,token)=>
{
    return useQuery(['get-student-wallet',id],()=>getStudentWallet(id,token))
}