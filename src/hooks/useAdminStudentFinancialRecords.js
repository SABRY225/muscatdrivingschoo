import { useQuery } from "react-query";

async function getAllCashBoxStudent(token) {

  const response = await fetch(
    `${process.env.REACT_APP_API_KEY}api/v1/admin/studentFinancialRecords`,
    {
      headers: {
        "Authorization": token,
      },
    }
  );
  const data =response.json();
  return data;
}

export const useAdminStudentFinancialRecords = (token) => {
  return useQuery("get-teachers-financial-records", () => getAllCashBoxStudent(token)
  );
};
