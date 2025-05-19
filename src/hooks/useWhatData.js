import {useQuery} from 'react-query'

async function getUrlWhatsApp(token)
{
    const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/getwhatsurl`,{
        headers:{
            "Authorization":token
        }
    });
    const data = response.json();
    console.log(data);
    return  data;
}

export const useWhatData = (token) =>
{
    return useQuery( ['get-url-whatsapp' , token],()=> getUrlWhatsApp(token) );
}