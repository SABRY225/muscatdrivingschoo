import { useQuery } from "react-query";

async function getAllCashBoxTeacher(token) {

  const response = await fetch(
    `${process.env.REACT_APP_API_KEY}api/v1/admin/teacherFinancialRecords/`,
    {
      headers: {
        "Authorization": token,
      },
    }
  );
  const data =response.json();
  return data;
}

export const useAdminTeacherFinancialRecords = (token) => {
  return useQuery("get-students-financial-records", () => getAllCashBoxTeacher(token)
  );
};
