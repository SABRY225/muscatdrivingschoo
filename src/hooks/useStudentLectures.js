import { useQuery } from "react-query";

async function getStudentLectures(id) {
  const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/student/lectures/${id}`);
  return response.json();
}

export const useStudentLectures = (id) => {
  return useQuery(["get-student-lectures", id], () =>  getStudentLectures(id) );
};
