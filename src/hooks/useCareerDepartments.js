import {useQuery} from 'react-query'

async function getCareerDepartments()
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/careerdepartments`)
    return response.json()
}

export const useCareerDepartments = ()=>
{
    return useQuery('get-career-department',getCareerDepartments)
}