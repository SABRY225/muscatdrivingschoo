import {useQuery} from 'react-query'

async function getParentsForStudent(studentId,token)
{

    console.log(token);

    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/student/getParentsByStudent/${studentId}`);
    let data = response.json();
    return data
}

export const useParentsForStudent = (studentId,token)=>
{
    return useQuery('get-Students-For-Parent',()=>getParentsForStudent(studentId,token))
}