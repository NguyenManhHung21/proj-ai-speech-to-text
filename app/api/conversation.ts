import { axiosInstance } from "@/service/axios-instance";

const BASE_ENTITY_URL = "/conversation";

export const getConversation = (id: string): Promise<Message[]> =>
  axiosInstance.get(`${BASE_ENTITY_URL}/${id}`);

export const deleteConversation = (id: number): Promise<{ id: string }> =>
  axiosInstance.delete(`${BASE_ENTITY_URL}/${id}`);
