import { useQuery } from "react-query";

async function getStudentDiscounts(id) {
  const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/student/discounts/${id}`);
  return response.json();
}

export const useStudentDiscounts = (id) => {
  return useQuery(["get-student-discounts", id], () =>  getStudentDiscounts(id) );
};
