import { Client } from "pg";

const client = new Client({
  connectionString: process.env.NETLIFY_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function connect() {
  if (!client._connected) {
    await client.connect();
    client._connected = true;
  }
}

export async function handler(event) {
  await connect();

  // ✅ GET → OBTENER CHISMES
  if (event.httpMethod === "GET") {
    const id = event.queryStringParameters?.id;

    const res = id
      ? await client.query("SELECT * FROM infieles WHERE id = $1", [id])
      : await client.query("SELECT * FROM infieles ORDER BY id DESC");

    return {
      statusCode: 200,
      body: JSON.stringify(id ? res.rows[0] : res.rows)
    };
  }

  // ✅ POST → GUARDAR CHISME
  if (event.httpMethod === "POST") {
    const body = JSON.parse(event.body);

    await client.query(
      `INSERT INTO infieles 
      (reportero, nombre, apellido, edad, ubicacion, historia, imagenes) 
      VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [
        body.reportero,
        body.nombre,
        body.apellido,
        body.edad,
        body.ubicacion,
        body.historia,
        body.imagenes
      ]
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true })
    };
  }

  return { statusCode: 405, body: "Method not allowed" };
}
