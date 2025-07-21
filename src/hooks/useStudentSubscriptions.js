import { useQuery } from "react-query";
import axios from "axios";

const fetchStudentSubscriptions = async (teacherId) => {
  const response = await axios.get(`${process.env.REACT_APP_API_KEY}api/v1/teacher/student/Subscriptions/${teacherId}`);

  return response.data;
};

export default function useStudentSubscriptions(teacherId) {
  return useQuery(["studentSubscriptions", teacherId], () => fetchStudentSubscriptions(teacherId), {
    enabled: !!teacherId,
  });
}
