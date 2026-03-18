import api from "./api";

const productService = {
  getProducts: async () => {
    const { data } = await api.get("/products");
    return data;
  },
  getProduct: async (id) => {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },
  addReview: async (id, payload) => {
    const { data } = await api.post(`/products/${id}/reviews`, payload);
    return data;
  },
  createProduct: async (payload) => {
    const { data } = await api.post("/products", payload);
    return data;
  },
  updateProduct: async (id, payload) => {
    const { data } = await api.put(`/products/${id}`, payload);
    return data;
  },
  deleteProduct: async (id) => {
    const { data } = await api.delete(`/products/${id}`);
    return data;
  }
};

export default productService;

