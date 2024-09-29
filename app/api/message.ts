import { axiosInstance } from "@/service/axios-instance";

const BASE_ENTITY_URL = "/message";

export const getAllConversation = (): Promise<AllConversationResponse[]> =>
  axiosInstance.get(`${BASE_ENTITY_URL}`);

export const createMessage = (
  newMsg: InputNewMessage
): Promise<MessageResponse> => axiosInstance.post(BASE_ENTITY_URL, newMsg);
