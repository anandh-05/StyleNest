export const getApiErrorMessage = (error, fallback = "Something went wrong. Please try again.") => {
  const payload = error?.response?.data;

  if (!payload) {
    return error?.message || fallback;
  }

  if (typeof payload === "string") {
    return payload;
  }

  if (payload.detail) {
    return payload.detail;
  }

  const firstKey = Object.keys(payload)[0];
  const firstValue = payload[firstKey];

  if (Array.isArray(firstValue)) {
    return firstValue[0];
  }

  if (typeof firstValue === "string") {
    return firstValue;
  }

  if (firstValue && typeof firstValue === "object") {
    const nestedKey = Object.keys(firstValue)[0];
    const nestedValue = firstValue[nestedKey];
    if (Array.isArray(nestedValue)) {
      return nestedValue[0];
    }
    if (typeof nestedValue === "string") {
      return nestedValue;
    }
  }

  return fallback;
};

