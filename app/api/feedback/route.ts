import { getD1 } from "../../../db";

export const dynamic = "force-dynamic";

type FeedbackPayload = {
  rating?: number;
  message?: string;
  page?: string;
};

function errorResponse(message: string, status = 500) {
  return Response.json({ error: message }, { status });
}

export async function GET() {
  try {
    const result = await getD1()
      .prepare(
        `SELECT id, rating, message, page, created_at AS createdAt
         FROM feedback
         ORDER BY id DESC
         LIMIT 500`
      )
      .all();

    return Response.json({ feedback: result.results });
  } catch (error) {
    console.error("Unable to load feedback", error);
    return errorResponse("Não foi possível carregar as avaliações agora.");
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as FeedbackPayload;
    const rating = Number(payload.rating);
    const message = payload.message?.trim().slice(0, 600) || null;
    const page = payload.page?.trim().slice(0, 120) || "/";

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return errorResponse("Escolha uma nota de 1 a 5.", 400);
    }

    const createdAt = new Date().toISOString();
    const result = await getD1()
      .prepare(
        `INSERT INTO feedback (rating, message, page, created_at)
         VALUES (?, ?, ?, ?)`
      )
      .bind(rating, message, page, createdAt)
      .run();

    return Response.json(
      { feedback: { id: result.meta.last_row_id, rating, message, page, createdAt } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Unable to save feedback", error);
    return errorResponse("Não foi possível enviar agora. Tente novamente.");
  }
}
