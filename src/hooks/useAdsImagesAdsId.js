import {useQuery} from 'react-query'

async function getAdsImagesByAdsId(AdsId)
{
    console.log("ID");
    console.log(AdsId);

    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/guest/adsimages/${AdsId}`)
    return response.json();
}

export const useAdsImagesAdsId = (AdsId) =>
{
    return useQuery(['get-adsimages-id' , AdsId],() => getAdsImagesByAdsId(AdsId) )
}