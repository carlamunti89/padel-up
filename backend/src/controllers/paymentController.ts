import { type Request, type Response } from "express";
import Stripe from "stripe";
import Pair from "../models/Pair.js";
import dotenv from "dotenv";

dotenv.config();

const stripeKey = process.env.STRIPE_SECRET_KEY || "";

if (!stripeKey) {
  console.error("❌ ERROR: La llave STRIPE_SECRET_KEY no está cargada.");
}

const stripe = new Stripe(stripeKey, {
  apiVersion: "2025-12-15.clover" as any,
});

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { pairId } = req.body;
    const pareja = await Pair.findById(pairId);

    if (!pareja) {
      return res.status(404).json({ error: "La pareja no existe" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Inscripción Padel Up: ${pareja.teamName}`,
              description: "Pago de inscripción para la pareja completa",
            },
            unit_amount: 3990,
          },
          quantity: 1,
        },
      ],
      mode: "payment",

      success_url:
        "http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5173/dashboard",

      metadata: { pairId },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error en Stripe:", error);
    res.status(500).json({ error: "No se pudo crear la sesión de pago" });
  }
};
