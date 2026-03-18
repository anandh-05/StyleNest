import api from "./api";

const orderService = {
  getOrders: async () => {
    const { data } = await api.get("/orders");
    return data;
  },
  createOrder: async (payload) => {
    const { data } = await api.post("/orders", payload);
    return data;
  },
  simulatePayment: async (payload) => {
    const { data } = await api.post("/payments/simulate", payload);
    return data;
  }
};

export default orderService;

