import { neon } from "@netlify/neon";

export default async (req) => {
  try {
    const sql = neon(); // ✅ Se crea dentro de la función (mejores conexiones)

    if (req.method === "GET") {
      const rows = await sql`
        SELECT * FROM infieles
        ORDER BY id DESC
      `;
      return Response.json(rows);
    }

    if (req.method === "POST") {
      const data = await req.json();

      await sql`
        INSERT INTO infieles (
          reportero,
          nombre,
          apellido,
          edad,
          ubicacion,
          historia,
          imagenes
        )
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
    return new Response(JSON.stringify({
      ok: false,
      error: err.message
    }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
