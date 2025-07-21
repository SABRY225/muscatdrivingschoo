import { useQuery } from "react-query";

async function getStudentSessions(id) {
  const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/student/get-bills-student/${id}`);
  return response.json();
}

export const useStudentSessions = (id, token) => {
  return useQuery(["get-student-session", id], () => getStudentSessions(id) );
};
