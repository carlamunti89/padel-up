import { z } from "zod";
import { type Request, type Response, type NextFunction } from "express";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const registrationSchema = z.object({
  teamName: z
    .string()
    .min(3, "El nombre del equipo debe tener al menos 3 caracteres"),
  captainFirstName: z.string().min(2, "El nombre del capitán es obligatorio"),
  captainLastName: z.string().min(2, "El apellido del capitán es obligatorio"),

  captainEmail: z
    .string()
    .regex(emailRegex, { message: "Email del capitán inválido" }),

  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  captainLevel: z.coerce
    .number()
    .min(0)
    .max(7, "El nivel debe estar entre 0 y 7"),
  player2FirstName: z.string().min(2, "El nombre del jugador 2 es obligatorio"),
  player2LastName: z
    .string()
    .min(2, "El apellido del jugador 2 es obligatorio"),

  player2Email: z
    .string()
    .regex(emailRegex, { message: "Email del jugador 2 inválido" }),

  player2Level: z.coerce
    .number()
    .min(0)
    .max(7, "El nivel debe estar entre 0 y 7"),
});

export const validateRegistration = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    registrationSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstErrorMessage =
        error.issues[0]?.message || "Datos de registro inválidos";
      return res.status(400).json({ error: firstErrorMessage });
    }
    res
      .status(400)
      .json({ error: "Ocurrió un error inesperado en la validación" });
  }
};
