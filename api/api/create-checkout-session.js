const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICE_ID = "price_1UEytf7g4ILCasqvAhCe9d2a";

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método não permitido"
    });
  }

  try {
    const { email } = req.body || {};

    if (!email) {
      return res.status(400).json({
        error: "E-mail não informado."
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",

      customer_email: email,

      line_items: [
        {
          price: PRICE_ID,
          quantity: 1
        }
      ],

      success_url:
        `${process.env.VEYRO_SITE_URL}?premium=success`,

      cancel_url:
        `${process.env.VEYRO_SITE_URL}?premium=cancelled`,

      metadata: {
        product: "veyro_premium"
      },

      subscription_data: {
        metadata: {
          product: "veyro_premium"
        }
      }
    });

    return res.status(200).json({
      url: session.url
    });

  } catch (error) {

    console.error("Erro Stripe:", error);

    return res.status(500).json({
      error: "Não foi possível criar o pagamento."
    });
  }
};
