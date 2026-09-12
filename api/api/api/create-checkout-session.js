const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",

      line_items: [
        {
          price: "price_1UEytf7g4ILCasqvAhCe9d2a",
          quantity: 1,
        },
      ],

      success_url: "https://SEU-SITE.vercel.app/sucesso.html",
      cancel_url: "https://SEU-SITE.vercel.app/",
    });

    res.status(200).json({
      url: session.url,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erro ao criar sessão de pagamento",
    });
  }
};
