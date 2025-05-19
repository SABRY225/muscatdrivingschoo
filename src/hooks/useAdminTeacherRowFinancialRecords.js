import { useQuery } from "react-query";

async function getCashBoxTeacherSingle(teacherId,token) {

  const response = await fetch(
    `${process.env.REACT_APP_API_KEY}api/v1/admin/rowTeacherFinancialRecords/${teacherId}`,
    {
      headers: {
        "Authorization": token,
      },
    }
  );
  const data  = response.json();
  return data;
}

export const useAdminTeacherRowFinancialRecords = (teacherId,token) => {
  return useQuery("get-row-teacher-financial-records", () => getCashBoxTeacherSingle(teacherId, token)
  );
};
