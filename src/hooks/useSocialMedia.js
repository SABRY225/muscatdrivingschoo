import { useQuery } from "react-query";

async function getSocialMedia(token) {
  const response = await fetch(
    `${process.env.REACT_APP_API_KEY}api/v1/admin/socialMedia/all`
  );
  return response.json();
}

export const useSocialMedia = () => {
  return useQuery("get-social-media", getSocialMedia);
};
