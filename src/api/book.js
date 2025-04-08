import api from "../api/axios";

export const allBooks = async () => {
  const response = await api.get("book");

  return response.data;
};

export const createBook = async (credentials) => {
  const response = await api.post("book", credentials);

  return response.data;
};

export const updateBook = async (credentials) => {
  const response = await api.put(`book/${credentials.id}`, credentials);

  return response.data;
};

export const deleteBook = async (credentials) => {
  const response = await api.delete(`book/${credentials.id}`);

  return response.data;
};
