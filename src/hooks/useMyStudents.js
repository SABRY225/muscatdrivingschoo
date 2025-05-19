import { useQuery } from "react-query";

async function getTeacherStudents(teacherId, token) {
  const response = await fetch(
    `${process.env.REACT_APP_API_KEY}api/v1/teacher/students/${teacherId}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return response.json();
}

export const useMyStudents = (teacherId, token) => {
  return useQuery(["get-teacher-students", teacherId], () =>
    getTeacherStudents(teacherId, token)
  );
};
