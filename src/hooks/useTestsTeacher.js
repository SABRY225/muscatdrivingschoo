import {useQuery} from 'react-query'

async function getTestsByTeacherId(id , token)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/tests/${id}`,{
        headers:{
            "Authorization":token
        }
    });
    return response.json();
}

export const useTestsTeacher = (id , token)=>
{
    return useQuery(['get-tests-teacher'],()=> getTestsByTeacherId(id , token))
}