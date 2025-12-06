export async function handler(event) {
  const DB = process.env.NETLIFY_DATABASE_URL;

  // ✅ GET → obtener chismes
  if (event.httpMethod === "GET") {
    const id = event.queryStringParameters?.id;

    const res = await fetch(DB, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sql: id
          ? "SELECT * FROM infieles WHERE id = $1"
          : "SELECT * FROM infieles ORDER BY id DESC",
        params: id ? [id] : []
      })
    });

    const data = await res.json();
    return {
      statusCode: 200,
      body: JSON.stringify(id ? data[0] : data)
    };
  }

  // ✅ POST → guardar chisme
  if (event.httpMethod === "POST") {
    const body = JSON.parse(event.body);

    await fetch(DB, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sql: `
          INSERT INTO infieles
          (reportero, nombre, apellido, edad, ubicacion, historia, imagenes)
          VALUES ($1,$2,$3,$4,$5,$6,$7)
        `,
        params: [
          body.reportero,
          body.nombre,
          body.apellido,
          body.edad,
          body.ubicacion,
          body.historia,
          JSON.stringify(body.imagenes)
        ]
      })
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true })
    };
  }

  return { statusCode: 405, body: "Method Not Allowed" };
}
