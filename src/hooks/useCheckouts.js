import { useQuery } from "react-query";

async function getNewCheckouts(token) {
  const response = await fetch(
    `${process.env.REACT_APP_API_KEY}api/v1/admin/getNewCheckoutRequests`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return response.json();
}

async function getProcessedCheckouts(token) {
  const response = await fetch(
    `${process.env.REACT_APP_API_KEY}api/v1/admin/getProcessedCheckoutRequests`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return response.json();
}

export const useNewCheckouts = (token) => {
  return useQuery("get-new-checkouts", () => getNewCheckouts(token));
};

export const useProcessedCheckouts = (token) => {
  return useQuery("get-processed-checkouts", () =>
    getProcessedCheckouts(token)
  );
};
