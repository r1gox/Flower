import { neon } from "@netlify/neon";

const sql = neon(); // usa NETLIFY_DATABASE_URL automático

export default async (req) => {
  try {

    // ✅ OBTENER TODOS LOS CHISMES
    if (req.method === "GET" && !req.queryStringParameters?.id) {
      const rows = await sql`
        SELECT * FROM infieles
        ORDER BY id DESC
      `;
      return Response.json(rows);
    }

    // ✅ OBTENER UN SOLO CHISME POR ID
    if (req.method === "GET" && req.queryStringParameters?.id) {
      const { id } = req.queryStringParameters;

      const [row] = await sql`
        SELECT * FROM infieles WHERE id = ${id}
      `;

      if (!row) {
        return new Response("No encontrado", { status: 404 });
      }

      return Response.json(row);
    }

    // ✅ INSERTAR NUEVO CHISME
    if (req.method === "POST") {
      const data = await req.json();

      await sql`
        INSERT INTO infieles
        (reportero, nombre, apellido, edad, ubicacion, historia, imagenes)
        VALUES
        (
          ${data.reportero},
          ${data.nombre},
          ${data.apellido},
          ${data.edad},
          ${data.ubicacion},
          ${data.historia},
          ${JSON.stringify(data.imagenes)}
        )
      `;

      return Response.json({ ok: true });
    }

    return new Response("Método no permitido", { status: 405 });

  } catch (err) {
    console.error(err);
    return new Response(err.message, { status: 500 });
  }
};
