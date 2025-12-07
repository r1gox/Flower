import { neon } from "@netlify/neon";
const sql = neon();

export default async (req) => {
  try {

    if (req.method === "GET") {
      const id = new URL(req.url).searchParams.get("id");
      if (id) {
        const [row] = await sql`SELECT * FROM infieles WHERE id = ${id}`;
        return Response.json(row);
      }
      const rows = await sql`SELECT * FROM infieles ORDER BY id DESC`;
      return Response.json(rows);
    }

    const data = await req.json();

    if (data.tipo === "nuevo") {
      await sql`
        INSERT INTO infieles 
        (reportero,nombre,apellido,edad,ubicacion,historia,imagenes)
        VALUES (${data.reportero},${data.nombre},${data.apellido},
        ${data.edad},${data.ubicacion},${data.historia},${data.imagenes})
      `;
      return Response.json({ ok: true });
    }

    if (data.tipo === "voto") {
      const campo = data.voto === "aprobar" ? "aprobados" :
                     data.voto === "refutar" ? "refutados" :
                     "denunciados";

      await sql`UPDATE infieles SET ${sql[field(campo)]} = ${sql[field(campo)]} + 1 WHERE id = ${data.id}`;
      return Response.json({ ok: true });
    }

    if (data.tipo === "comentario") {
      await sql`
        UPDATE infieles 
        SET comentarios = comentarios || ${JSON.stringify([data.comentario])}
        WHERE id = ${data.id}
      `;
      return Response.json({ ok: true });
    }

    return new Response("Acción inválida", { status: 400 });

  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
};
