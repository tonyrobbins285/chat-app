import jwt from "jsonwebtoken";

type User = { id: string; email: string };

export const createAccessToken = (user: User) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "30s",
  });
};

export const createRefreshToken = (user: User) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: "1d",
  });
};
