import argon2 from "argon2";
import jwt from "jsonwebtoken";

export const generateTokenForUsers = (
  userId: string,
  role: string
): string => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    throw new Error("Invalid token");
  }
};

export async function hashPassword(password: string): Promise<string> {
  const hash = await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 18,
    timeCost: 5,
    parallelism: 4,
  });
  return hash;
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return argon2.verify(hash, password);
}