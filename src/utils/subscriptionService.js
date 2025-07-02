import axios from "axios";

export const checkStudentSubscription = async (StudentId, type,val) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_KEY}api/v1/student/check-subscription/${StudentId}/${type}/${val}`
    );

    if (response.data.status === 200) {
      const { subscription, msg } = response.data;
      return { isSubscribed: subscription, message: msg };
    } else {
      return { isSubscribed: false, message: response.data.msg };
    }
  } catch (error) {
    console.error("Error checking subscription:", error);
    return {
      isSubscribed: false,
      message: {
        arabic: "حدث خطأ",
        english: "Something went wrong",
      },
    };
  }
};
