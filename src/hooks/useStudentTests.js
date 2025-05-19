import { useQuery } from "react-query";

async function getStudentTests(id) {
  const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/student/tests/${id}`);
  return response.json();
}

export const useStudentTests = (id, token) => {
  return useQuery(["get-student-tests", id], () => getStudentTests(id) );
};
