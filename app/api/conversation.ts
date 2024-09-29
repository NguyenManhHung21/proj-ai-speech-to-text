import { axiosInstance } from "@/service/axios-instance";

const BASE_ENTITY_URL = "/conversation";

export const getConversation = (id: string): Promise<Message[]> =>
  axiosInstance.get(`${BASE_ENTITY_URL}/${id}`);
