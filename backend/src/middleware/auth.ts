import { expressjwt } from "express-jwt";

export const authenticate = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  requestProperty: "auth",
});
