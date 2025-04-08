import api from "./axios";

export const getFormOptions = async () => {
  const response = await api.get("borrowings/form-options");

  return response.data;
};

export const allBorrowings = async () => {
  const response = await api.get("borrowing");

  return response.data;
};

export const createBorrowing = async (credentials) => {
  const response = await api.post("borrowing", credentials, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const updateBorrowing = async (credentials) => {
  const response = await api.post(
    `borrowing/${credentials.id}?_method=PUT`,
    credentials,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const deleteBorrowing = async (credentials) => {
  const response = await api.delete(`borrowing/${credentials.id}`);

  return response.data;
};

export const exportBorrowing = async (credentials) => {
  const response = await api.post(`borrowing/export`, credentials);

  return response.data;
};

export const importBorrowing = async (credentials) => {
  const response = await api.post(`borrowing/import`, credentials, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
