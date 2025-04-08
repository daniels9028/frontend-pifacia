import api from "../api/axios";

export const allRoles = async () => {
  const response = await api.get("role");

  return response.data;
};

export const createRole = async (credentials) => {
  const response = await api.post("role", credentials);

  return response.data;
};

export const updateRole = async (credentials) => {
  const response = await api.put(`role/${credentials.id}`, credentials);

  return response.data;
};

export const deleteRole = async (credentials) => {
  const response = await api.delete(`role/${credentials.id}`);

  return response.data;
};
