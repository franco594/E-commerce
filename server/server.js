
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';

import { MercadoPagoConfig, Preference } from "mercadopago";
const client = new MercadoPagoConfig({
  accessToken: "APP_USR-4481331785193743-091000-b9a1cbaee820650c567f7c4795f76fba-224036040", //agregar el token
});

const app = express();
const port = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '..', 'client')));

app.get("/", (req, res) => {
	res.sendFile(path.resolve(__dirname, '..', 'client', 'index.html'));
  });

app.post("/create_preference", async (req, res) => {
  try {
    const body = {
      items: [
        {
          title: req.body.description,
          unit_price: Number(req.body.price),
          quantity: Number(req.body.quantity),
          currency_id: "ARS",
        },
      ],
      back_urls: {
        success: "http://localhost:8080/",
        failure: "http://localhost:8080/",
        pending: "http://localhost:8080/",
      },
      auto_return: "approved",
    };

    const preference = new Preference(client);
    const result = await preference.create({ body });
    res.json({
      id: result.id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Error al crear la preferencia",
    });
  }
});

app.listen(port, () => {
	console.log('The server is now running on Port 8080');
});