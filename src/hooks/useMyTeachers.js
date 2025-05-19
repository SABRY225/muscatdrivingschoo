import { useQuery } from "react-query";

async function getStudentTeachers(studentId) {
  const response = await fetch(
    `${process.env.REACT_APP_API_KEY}api/v1/student/teachers/${studentId}`
  );
  return response.json();
}

export const useMyTeachers = (studentId) => {
  return useQuery(["get-student-teachers", studentId], () =>
    getStudentTeachers(studentId)
  );
};
