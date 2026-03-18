const AUTH_STORAGE_KEY = "stylenest-auth";
const CART_STORAGE_KEY = "stylenest-cart";

const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

export const getStoredAuth = () => {
  if (typeof window === "undefined") {
    return { access: null, refresh: null, user: null };
  }

  const parsed = safeParse(window.localStorage.getItem(AUTH_STORAGE_KEY), {});
  return {
    access: parsed?.access ?? null,
    refresh: parsed?.refresh ?? null,
    user: parsed?.user ?? null
  };
};

export const setStoredAuth = (session) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
};

export const clearStoredAuth = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const getStoredCart = () => {
  if (typeof window === "undefined") {
    return [];
  }

  return safeParse(window.localStorage.getItem(CART_STORAGE_KEY), []);
};

export const setStoredCart = (cart) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
};

export const clearStoredCart = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(CART_STORAGE_KEY);
};

