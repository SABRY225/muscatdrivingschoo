import {useQuery} from 'react-query'

async function getParent(id, token)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/parent/get/${id}`,{
        headers:{
            "Authorization":token
        }
    })
    return response.json()
}

export const useParent = (id , token)=>
{
    return useQuery(['get-student',id],()=>getParent(id , token))
}