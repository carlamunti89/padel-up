import { type Request, type Response } from "express";
import User from "../models/User.js";
import Pair from "../models/Pair.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerPair = async (req: Request, res: Response) => {
  try {
    const {
      teamName,
      captainFirstName,
      captainLastName,
      captainEmail,
      captainPhone,
      password,
      captainLevel,
      player2FirstName,
      player2LastName,
      player2Email,
      player2Phone,
      player2Level,
    } = req.body;

    const captainUser = await User.create({
      firstName: captainFirstName,
      lastName: captainLastName,
      email: captainEmail,
      phone: captainPhone,
      password: password,
    });

    const player2User = await User.create({
      firstName: player2FirstName,
      lastName: player2LastName,
      email: player2Email,
      phone: player2Phone,
      password: "padelup_invitation_2026",
    });

    const averageLevel = (Number(captainLevel) + Number(player2Level)) / 2;

    const newPair = await Pair.create({
      teamName,
      captain: captainUser._id,
      player2: player2User._id,
      captainLevel,
      player2Level,
      averageLevel,
      points: 100,
      isPaid: false,
    });

    res.status(201).json({
      message: "Registro completado. Pareja creada.",
      pairId: newPair._id,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).json({
      error:
        "Error al registrar: El email, teléfono o nombre de equipo ya existen.",
    });
  }
};

export const loginPair = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Credenciales inválidas" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Credenciales inválidas" });
    }

    const pair = await Pair.findOne({
      $or: [{ captain: user._id }, { player2: user._id }],
    });

    const token = jwt.sign(
      { id: user._id, pairId: pair?._id },
      process.env.JWT_SECRET || "provisional_secret_key",
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
      pair,
    });
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor" });
  }
};
