import { useQuery } from "react-query";

async function getStudentFinancialRecords(id, token) {
  const response = await fetch(
    `${process.env.REACT_APP_API_KEY}api/v1/student/financialRecords/${id}`,
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

export const useStudentFinancialRecords = (id, token) => {
  return useQuery(["get-student-financial-records", id], () =>
    getStudentFinancialRecords(id, token)
  );
};
