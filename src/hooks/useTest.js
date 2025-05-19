import {useQuery} from 'react-query'

async function getTest(testId)
{
    console.log(testId);
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/test/${testId}`);
    const data = response.json();
    return data;
}

export const useTest = (testId) =>
{
    return useQuery(['get-test-single' , testId ],()=> getTest(testId))
}