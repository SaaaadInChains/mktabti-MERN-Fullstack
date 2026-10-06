import { type Request, type Response, type NextFunction } from "express";

export const requireWorker = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const auth = req.auth;

  if (!auth || !auth.role) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  if (auth.role !== "worker" && auth.role !== "admin") {
    res.status(403).json({ message: "Access denied: workers or admin only" });
    return;
  }

  next();
};
