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
