import {useQuery} from 'react-query'

async function getDiscountsByTeacherId(teacherId , token)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/discounts/${teacherId}`,{
        headers:{
            "Authorization":token
        }
    });
    return response.json();
}

export const useDiscountsTeacher = (teacherId , token) =>
{
    return useQuery(['get-discounts-teacher' , teacherId ],()=> getDiscountsByTeacherId(teacherId , token) )
}