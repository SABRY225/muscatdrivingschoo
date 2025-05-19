import { useQuery } from "react-query";

async function getAllCashBoxStudentSingle(studentId,token) {

  const response = await fetch(
    `${process.env.REACT_APP_API_KEY}api/v1/admin/rowStudentFinancialRecords/${studentId}`,
    {
      headers: {
        "Authorization": token,
      },
    }
  );
  const data  = response.json();
  return data;
}

export const useAdminStudentRowFinancialRecords = (studentId,token) => {
  return useQuery("get-row-student-financial-records", () => getAllCashBoxStudentSingle(studentId, token)
  );
};
