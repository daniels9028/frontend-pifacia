import api from "./axios";

export const auditBooks = async () => {
  const response = await api.get("books/audit");

  return response.data;
};

export const auditMembers = async () => {
  const response = await api.get("members/audit");

  return response.data;
};

export const auditBorrowing = async () => {
  const response = await api.get("borrowings/audit");

  return response.data;
};
