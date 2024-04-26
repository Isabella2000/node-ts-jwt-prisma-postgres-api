import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controller/usersController";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "default-secret";
//MiddleWire
const autheticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  console.log("authHeader",authHeader)
  const token = authHeader && authHeader.split(" ")[1];
  console.log("token", token)
  if (!token) {
    res.status(401).json({ error: "No autorizado, ingrese nuevamente" });
    return;
  }
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Error de autenticacion", err);
      return res.status(403).json({ error: "No tienes acceso al recurso o no pasas a eesta esquina" });
    }
    next();
  });
};

router.post("/", autheticateToken, createUser);
router.get("/", autheticateToken, getAllUsers);
router.get("/:id", autheticateToken, getUserById);
router.put("/:id", autheticateToken, updateUser);
router.delete("/:id", autheticateToken, deleteUser);

export default router;
