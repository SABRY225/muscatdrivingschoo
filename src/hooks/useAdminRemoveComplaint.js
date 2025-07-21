import { useMutation } from 'react-query';

async function removeComplaint(id) {
  const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/message/remove/${id}`, {
    method: 'DELETE',
  });
  return response.json();
}

export const useAdminRemoveComplaint = () => {
  return useMutation(removeComplaint);
};
