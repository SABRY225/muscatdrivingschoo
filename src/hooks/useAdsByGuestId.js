import {useQuery} from 'react-query'

async function getAdsByGuestId(GuestId)
{   
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/guest/ads/${GuestId}`)
    return response.json();
}

export const useAdsByGuestId = (GuestId) =>
{
    return useQuery(['get-ads-guest-id' , GuestId], ()=> getAdsByGuestId(GuestId) )
}