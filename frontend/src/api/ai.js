import axiosInstance from "../lib/axios";

export const aiApi = {
  getFeedback: async (payload) => {
    const response = await axiosInstance.post("/chat/feedback", payload);
    return response.data;
  },
};
