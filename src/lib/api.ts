import axios from "axios";

export const BASE_URL = "https://oghie-store.vercel.app";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem("refresh_token");
      if (refresh) {
        try {
          const { data } = await axios.post(`${BASE_URL}/api/auth/token/refresh/`, { refresh });
          localStorage.setItem("access_token", data.access);
          original.headers.Authorization = `Bearer ${data.access}`;
          return api(original);
        } catch {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }
      }
    }
    return Promise.reject(err);
  }
);

export default api;

// --- Auth ---
export const authApi = {
  login: (username: string, password: string) =>
    api.post("/api/auth/token/", { username, password }),
  me: () => api.get("/api/auth/me/"),
  updateProfile: (id: number, data: Record<string, unknown>) =>
    api.patch(`/api/auth/profiles/${id}/`, data),
};

// --- Products ---
export const productsApi = {
  list: (params?: Record<string, unknown>) =>
    api.get("/api/products/", { params }),
  get: (slug: string) => api.get(`/api/products/${slug}/`),
  categories: () => api.get("/api/products/categories/"),
  currencies: () => api.get("/api/products/currencies/"),
  reviews: (productSlug: string) =>
    api.get("/api/products/reviews/", { params: { product: productSlug } }),
  addReview: (data: { product: number; rating: number; title: string; comment: string }) =>
    api.post("/api/products/reviews/", data),
  wishlist: () => api.get("/api/products/wishlist/"),
  addWishlist: (productId: number) =>
    api.post("/api/products/wishlist/", { product: productId }),
  removeWishlist: (id: number) => api.delete(`/api/products/wishlist/${id}/`),
};

// --- Cart ---
export const cartApi = {
  active: () => api.get("/api/orders/cart/active/"),
  addItem: (productId: number, quantity: number) =>
    api.post("/api/orders/cart/items/", { product: productId, quantity }),
  updateItem: (id: number, quantity: number) =>
    api.patch(`/api/orders/cart/items/${id}/`, { quantity }),
  removeItem: (id: number) => api.delete(`/api/orders/cart/items/${id}/`),
  applyCoupon: (cartId: number, couponId: number) =>
    api.patch(`/api/orders/cart/${cartId}/`, { coupon: couponId }),
  checkout: (
    cartId: number,
    data: { shipping_address: string; billing_address: string; notes?: string }
  ) => api.post(`/api/orders/cart/${cartId}/checkout/`, data),
};

// --- Orders ---
export const ordersApi = {
  mine: () => api.get("/api/orders/mine/"),
  get: (id: number) => api.get(`/api/orders/mine/${id}/`),
};

// --- CMS ---
export const cmsApi = {
  sections: () => api.get("/api/cms/sections/"),
};
