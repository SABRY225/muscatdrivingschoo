import {useQuery} from 'react-query'

async function getTeacherTests(TeacherId)
{
    //console.log(TeacherId);

    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/testsTeacherId/${TeacherId}`);
    const data = response.json();
    console.log(data);

    return data;
}

export const useTeacherTests = (TeacherId)=>
{
    return useQuery(['get-teacher-tests' , TeacherId],()=> getTeacherTests(TeacherId))
}