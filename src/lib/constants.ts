export const CLIENT_URL = "http://localhost:3000";
export const TOKEN_TTL = {
  ACCESS: 1000 * 60 * 60 * 8, // 8 hrs
  REFRESH: 1000 * 60 * 60 * 24 * 7, // 7d
  VERIFICATION: 1000 * 60 * 60 * 24 * 7, //7d
};
export const ACCOUNT_TYPES = {
  CREDENTIALS: "credentials",
  GITHUB: "github",
};
