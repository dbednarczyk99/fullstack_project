export const API_URL =
  process.env.NODE_ENV === "production" ? "/" : "http://localhost:8000/";

export const IMGS_URL =
  process.env.NODE_ENV === "production"
    ? "/uploads/"
    : "http://localhost:8000/uploads/";

export const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2 MB
export const MAX_AD_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
