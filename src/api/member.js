import api from "./axios";

export const allMembers = async () => {
  const response = await api.get("member");

  return response.data;
};

export const createMember = async (credentials) => {
  const response = await api.post("member", credentials);

  return response.data;
};

export const updateMember = async (credentials) => {
  const response = await api.put(`member/${credentials.id}`, credentials);

  return response.data;
};

export const deleteMember = async (credentials) => {
  const response = await api.delete(`member/${credentials.id}`);

  return response.data;
};

export const exportMember = async (credentials) => {
  const response = await api.post(`member/export`, credentials);

  return response.data;
};

export const importMember = async (credentials) => {
  const response = await api.post(`member/import`, credentials, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
