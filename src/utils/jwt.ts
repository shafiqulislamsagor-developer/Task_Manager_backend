import jwt from "jsonwebtoken";

export const generateAccessToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "1m",
  });
};

export const generateRefreshToken = (userId: string, role: string) => {
  return jwt.sign(
    { userId, role },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "7d" }
  );
};

export default { generateAccessToken, generateRefreshToken };
