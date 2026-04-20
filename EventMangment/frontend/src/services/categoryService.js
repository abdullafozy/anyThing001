import api from "./api.js";

export async function getCategories() {
  const response = await api.get("/categories");
  return response.data;
}
