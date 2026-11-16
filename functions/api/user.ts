type Env = { DB: D1Database };
const json = (d: unknown, s = 200) =>
  new Response(JSON.stringify(d), {
    status: s,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'access-control-allow-origin': '*',
    },
  });

export const onRequest = async ({ request, env }: { request: Request; env: Env }) => {
  if (request.method === 'OPTIONS') return json(null, 204);
  try {
    const body = request.method === 'POST' ? await request.json().catch(() => ({})) : {};
    const action = (body as any).action || new URL(request.url).searchParams.get('action');
    if (action === 'profile') {
      const id = (body as any).id || new URL(request.url).searchParams.get('id');
      if (!id) return json({ message: 'missing id' }, 400);
      const u = await env.DB.prepare(
        'SELECT id,username,email,role,balance,points,total_spent,spin_count,created_at,photo_url FROM users WHERE id=?',
      )
        .bind(id)
        .first();
      if (!u) return json({ message: 'not found' }, 404);
      return json({ user: u });
    }
    return json({ message: 'ok' });
  } catch (e) {
    console.error(e);
    return json({ message: 'error' }, 500);
  }
};
