import prisma from "../models/user";
import { Request, Response } from "express";
import { hashPassword } from "../services/password.service";

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;
  try {
    if (!email) {
      res.status(400).json({ error: "Debe ingresar el Email" });
      return;
    }
    if (!password) {
      res.status(400).json({ error: "Debe ingresar la contraseña" });
      return;
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json(user);
  } catch (error: any) {
    if (error?.code === "P2002" && error?.meta?.target?.includes("email")) {
      res.status(400).json({ error: "Ya existe este email" });
    }
    console.log(error);
    res.status(500).json({ error: "HUBO UN ERROR BIEN GENERICO" });
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await prisma.findMany();
    res.status(200).json(users);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: "HUBO UN ERROR" });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = parseInt(req.params.id);
  try {
    const user = await prisma.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      res.status(404).json({ error: "El usuario no fue encontrado" });
    }
    res.status(200).json(user);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: "HUBO UN ERROR" });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;
  const userId = parseInt(req.params.id);
  try {
    let dataToUpdate: any = { ...req.body };
    if (password) {
      const hashedPassword = await hashPassword(password);
      dataToUpdate.password = hashedPassword;
    }
    if (email) {
      dataToUpdate.email = email;
    }
    const user = await prisma.update({
      where: {
        id: userId,
      },
      data: dataToUpdate,
    });
    res.status(200).json(user);
  } catch (error: any) {
    if (error?.code === "P2002" && error?.meta?.target?.includes("email")) {
      res.status(400).json({ error: "Ya existe este email" });
    } else if (error?.code === "P2025") {
      res.status(404).json({ error: "Usuario no encontrado" });
    } else {
      console.log(error);
      res.status(500).json({ error: "HUBO UN ERROR" });
    }
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = parseInt(req.params.id);
  try {
    await prisma.delete({
      where: {
        id: userId,
      },
    });
    res
      .status(200)
      .json({ message: `El usuario ${userId} ha sido eliminado con exito` })
      .end();
  } catch (error: any) {
    if (error?.code === "P2002" && error?.meta?.target?.includes("email")) {
      res.status(400).json({ error: "Ya existe este email" });
    } else if (error?.code === "P2025") {
      res.status(404).json({ error: "Usuario no encontrado" });
    } else {
      console.log(error);
      res.status(500).json({ error: "HUBO UN ERROR" });
    }
  }
};
