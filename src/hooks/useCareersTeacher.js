import { useQuery } from 'react-query';

async function getCareersTeacher(id) {
  console.log(id);
  const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/careers/${id}`);
  return response.json();
}

export const useCareersTeacher = (id) => {
  return useQuery(['get-careers-teacher', id], () => getCareersTeacher(id), {
    enabled: !!id, // منع التنفيذ قبل توفر id
  });
};
