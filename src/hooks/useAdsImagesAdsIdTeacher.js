import {useQuery} from 'react-query'

async function getAdsImagesByAdsIdTeacher(AdsId)
{
    console.log("ID");
    console.log(AdsId);

    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/ads-images/${AdsId}`)
    return response.json();
}

export const useAdsImagesAdsIdTeacher = (AdsId) =>
{
    return useQuery(['get-ads-images-id' , AdsId],() => getAdsImagesByAdsIdTeacher(AdsId) )
}