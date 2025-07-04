import {useQuery} from 'react-query'

async function getStudentsForParent(parentId,token)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/parent/getStudents/${parentId}`,{
        headers:{
            "Authorization":token
        }
    })
    let data = response.json();
    return data
}

export const useStudentsForParent = (parentId,token)=>
{
    return useQuery('get-Students-For-Parent',()=>getStudentsForParent(parentId,token))
}