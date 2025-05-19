import {useQuery} from 'react-query'

async function getTrainingCategoryTypes()
{
    console.log("get Data Traing Category Type");
    
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/trainingcategorytypes`)
    return response.json()
}

export const useTrainingCategoryTypes = ()=>
{
    return useQuery('get-TrainingCategoryTypes',getTrainingCategoryTypes)
}