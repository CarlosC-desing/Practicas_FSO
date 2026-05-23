const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

let products = [
  {
    id: 1,
    name: "Espresso",
    price: 1.5,
  },
  {
    id: 2,
    name: "Cappuccino",
    price: 2.75,
  },
  {
    id: 3,
    name: "Muffin de Arandanos",
    price: 2,
  },
];

app.get("/api/products", (request, response) => {
  response.json(products);
});

app.get("/api/products/:id", (request, response) => {
  const id = Number(request.params.id);
  const product = products.find((p) => p.id === id);
  if (product) {
    response.json(product);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/products/:id", (request, response) => {
  const id = Number(request.params.id);
  products = products.filter((p) => p.id !== id);
  response.status(204).end();
});

const generateId = () => {
  return Math.floor(
    Math.random() * (10000 - products.length) + products.length,
  );
};

app.post("/api/products", (request, response) => {
  const body = request.body;

  if (!body.name || !body.price) {
    response.status(400).json({
      error: "Name or price missing",
    });
  }

  const exist = products.some(
    (p) => p.name.toLowerCase() === body.name?.toLowerCase(),
  );

  if (exist) {
    response.status(400).json({
      error: "Item must be unique",
    });
  }

  const product = {
    id: generateId(),
    name: body.name,
    price: body.price,
  };

  products = products.concat(product);

  response.json(products);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
