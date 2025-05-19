import { useQuery } from "react-query";

async function getStudentPackages(id) {
  const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/student/packages/${id}`);
  return response.json();
}

export const useStudentPackages = (id) => {
  return useQuery(["get-student-packages", id], () =>  getStudentPackages(id) );
};
