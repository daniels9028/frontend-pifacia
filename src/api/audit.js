import api from "./axios";

export const audit = async () => {
  const response = await api.get("audit");

  return response.data;
};
