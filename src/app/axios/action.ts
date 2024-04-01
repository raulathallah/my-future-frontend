import axios from "axios";
import { baseURL } from "../_lib/baseURL";

export const getAllAction = async () => {
  const response = await axios.get(baseURL + "/api/action/get-all");
  return response;
};

export const createAction = async (body: ActionBody) => {
  const response = await axios.post(baseURL + "/api/action/create", body);
  return response;
};

export const deleteAction = async (id: string) => {
  const response = await axios.delete(baseURL + `/api/action/delete/${id}`);
  return response;
};

export const editAction = async (id: string, body: ActionBody) => {
  const response = await axios.put(baseURL + `/api/action/update/${id}`, body);
  return response;
};
