import { useQuery } from "react-query";

async function getMap(id, token) {
  const response = await fetch(
    `${process.env.REACT_APP_API_KEY}api/v1/student/nearestTeachers/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    }
  );
  return response.json();
}

export const useStudentMap = (id, token) => {
  return useQuery(["get-map", id], () => getMap(id, token));
};
