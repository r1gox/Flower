import { neon } from "@netlify/neon";

const sql = neon(); // Usa NETLIFY_DATABASE_URL automático

export default async (req) => {
  try {
    if (req.method === "GET") {
      const rows = await sql`SELECT * FROM infieles ORDER BY id DESC`;
      return Response.json(rows);
    }

    if (req.method === "POST") {
      const data = await req.json();

      await sql`
        INSERT INTO infieles (reportero, nombre, apellido, edad, ubicacion, historia, imagenes)
        VALUES (
          ${data.reportero},
          ${data.nombre},
          ${data.apellido},
          ${data.edad},
          ${data.ubicacion},
          ${data.historia},
          ${data.imagenes}
        )
      `;

      return Response.json({ ok: true });
    }

    return new Response("Método no permitido", { status: 405 });

  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
};
