export async function GET() {
  return Response.json({ method: "GET", count: 100 });
}
