import {useQuery} from 'react-query'

async function getMainBoxesTeacher(TeacherId,token)
{
    console.log("Teacher ID :- ");
    console.log(TeacherId);
    console.log(token);
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/numbers/${TeacherId}`,{
        headers:{
            "Authorization":token
        }
    });
    const data = response.json();
    return data;
}

export const useMainBoxesTeacher = (TeacherId , token)=>
{
    return useQuery('get-admin-boxes',()=>getMainBoxesTeacher(TeacherId , token))
}