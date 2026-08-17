import express, { type Express, type Request, type Response } from "express";

const app: Express = express();

import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// app.get("/", (req: Request, res: Response) => {
//   const timestamp = new Date().toLocaleTimeString("de-CH");
//   console.log("api called /hello", timestamp);

//   res.send("Hello World!");
// });

// app.get("/check", (req: Request, res: Response) => {
//   console.log(req);

//   res.send("ok");
// });

app.use(express.json());
app.set("json spaces", 2);

interface StarWarsCharacter {
  id: number;
  name: string;
  height: string;
  mass: string;
  birth_year: string;
  homeworld: string;
}

// 1. GET – alle Charaktere aus der DB
app.get("/starwarscharacters", async (req: Request, res: Response) => {
  const [rows] = await connection.query("SELECT * FROM starwarscharacters");
  res.json(rows);
});

// 2. GET – Einzelnes Objekt zurückgeben
app.get("/starwarscharacters/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [rows] = await connection.query<mysql.RowDataPacket[]>(
    "SELECT * FROM starwarscharacters WHERE id = ?",
    [id],
  );

  if (rows.length === 0) {
    return res
      .status(404)
      .json({ error: `Character mit id ${id} nicht gefunden` });
  }
  res.json(rows[0]);
});

// 3. POST – Objekt erstellen und zurückgeben
app.post("/starwarscharacters/new", async (req: Request, res: Response) => {
  const newCharacter: StarWarsCharacter = {
    id: 0,
    name: "Boba Fett",
    height: "183",
    mass: "78.2",
    birth_year: "31.5BBY",
    homeworld: "Kamino",
  };

  const [result] = await connection.query<mysql.ResultSetHeader>(
    "INSERT INTO starwarscharacters (name, height, mass, birth_year, homeworld) VALUES (?, ?, ?, ?, ?)",
    [
      newCharacter.name,
      newCharacter.height,
      newCharacter.mass,
      newCharacter.birth_year,
      newCharacter.homeworld,
    ],
  );
  newCharacter.id = result.insertId;

  console.log("Neuer Character erstellt:", newCharacter);

  res.status(201).json(newCharacter);
});

// 4. DELETE – Objekt löschen, leere Antwort zurückgeben
app.delete("/starwarscharacters/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [result] = await connection.query<mysql.ResultSetHeader>(
    "DELETE FROM starwarscharacters WHERE id = ?",
    [id],
  );

  if (result.affectedRows === 0) {
    return res
      .status(404)
      .json({ error: `Character mit id ${id} nicht gefunden` });
  }

  res.status(200).json({}); // leeres Objekt zurückgeben
});

// 5. PUT – Objekt aktualisieren und zurückgeben
app.put("/starwarscharacters/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [existingRows] = await connection.query<mysql.RowDataPacket[]>(
    "SELECT * FROM starwarscharacters WHERE id = ?",
    [id],
  );

  if (existingRows.length === 0) {
    return res
      .status(404)
      .json({ error: `Character mit id ${id} nicht gefunden` });
  }

  const updated = { ...existingRows[0], ...req.body } as StarWarsCharacter;
  await connection.query(
    "UPDATE starwarscharacters SET name = ?, height = ?, mass = ?, birth_year = ?, homeworld = ? WHERE id = ?",
    [
      updated.name,
      updated.height,
      updated.mass,
      updated.birth_year,
      updated.homeworld,
      id,
    ],
  );

  res.json(updated);
});

app.listen(3000);
